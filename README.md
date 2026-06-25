# README — Mondiali IPTV (FR)

Sommaire
--------
1. Présentation rapide
2. Prérequis
3. Installation détaillée (local)
4. Configuration (env)
5. Développement (dev workflow)
6. Intégration Backend & persistance (exemples complets)
7. Checklist production
8. CI / déploiement
9. Exemples de code (service, hooks, persistance)
10. FAQ & dépannage

1) Présentation rapide
----------------------
Mondiali IPTV est une appli Expo/React Native pour parcourir et regarder des chaînes/matchs IPTV, gérer des favoris et supporter usage offline simple.

2) Prérequis
------------
- Node.js >= 18 (ou Bun)
- npm ou bun
- Expo CLI (ou npx expo)
- Expo Go (mobile) ou simulateurs Android/iOS
- (Optionnel) Docker & Docker Compose pour backend

3) Installation détaillée (local)
---------------------------------
Cloner et installer :
```bash
git clone https://github.com/eliendombe/mondiali_iptv_v1.git
cd mondiali_iptv_v1/expo
# npm
npm install
# ou bun
# bun install
```

Démarrer l'application (dev)
```bash
npm run dev        # expo start --tunnel
# ou
npm run start-web  # expo start --web --tunnel
```
Ouvrir Expo Go via QR, ou lancer émulateur Android / iOS.

4) Configuration (variables d'environnement)
--------------------------------------------
- API_URL — URL du backend (ex: https://api.example.com)
- NODE_ENV — development | production
- SENTRY_DSN — (optionnel) pour crash reporting
- EAS_PROJECT_ID — (optionnel) pour builds EAS

Stockage local
- Favoris persisted via AsyncStorage (clé configurable dans le code).

5) Développement & debug
------------------------
- Utiliser fixtures `expo/app/data/*.ts` pour développement sans backend.
- Linter : `npm run lint`
- Vérifier lecteur vidéo sur appareils physiques (HLS).
- Pour logs natifs : `adb logcat` (Android) / Xcode (iOS).

6) Intégration backend & persistance — exemples complets
--------------------------------------------------------

A) Backend minimal — Node.js + Express + Prisma (exemples)
- Prisma schema (extrait)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  favorites Favorite[]
}

model Channel {
  id    String  @id @default(uuid())
  name  String
  logo  String?
}

model Favorite {
  id        String  @id @default(uuid())
  userId    String
  channelId String
  user      User    @relation(fields: [userId], references: [id])
  channel   Channel @relation(fields: [channelId], references: [id])
}
```

- Serveur Express (extrait)
```ts
import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());

app.get("/channels", async (req, res) => {
  const channels = await prisma.channel.findMany();
  res.json(channels);
});

app.get("/channels/:id", async (req, res) => {
  const channel = await prisma.channel.findUnique({ where: { id: req.params.id }});
  res.json(channel);
});

app.get("/users/:id/favorites", async (req, res) => {
  const favs = await prisma.favorite.findMany({ where: { userId: req.params.id }});
  res.json(favs.map(f => f.channelId));
});

app.post("/users/:id/favorites", async (req, res) => {
  const { channelId } = req.body;
  await prisma.favorite.create({ data: { userId: req.params.id, channelId }});
  res.status(201).end();
});

app.delete("/users/:id/favorites/:channelId", async (req, res) => {
  await prisma.favorite.deleteMany({ where: { userId: req.params.id, channelId: req.params.channelId }});
  res.status(204).end();
});

app.listen(3000, () => console.log("API started on :3000"));
```

- Docker Compose (extrait)
```yaml
version: "3.8"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: prisma
      POSTGRES_PASSWORD: prisma
      POSTGRES_DB: mondiali
    volumes:
      - db-data:/var/lib/postgresql/data
  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://prisma:prisma@db:5432/mondiali
    ports:
      - "3000:3000"
volumes:
  db-data:
```

B) Intégration Frontend (exemples TypeScript)
- iptvService (axios)
```ts
import axios from "axios";
const API_URL = process.env.API_URL ?? "http://localhost:3000";

export type Channel = { id: string; name: string; logo?: string; streams?: { quality: string; url: string }[]; isLive?: boolean; };

export async function fetchChannels() { const { data } = await axios.get(`${API_URL}/channels`); return data as Channel[]; }
export async function fetchChannel(id: string) { const { data } = await axios.get(`${API_URL}/channels/${id}`); return data as Channel; }
export async function postFavorite(userId: string, channelId: string) { return axios.post(`${API_URL}/users/${userId}/favorites`, { channelId }); }
export async function deleteFavorite(userId: string, channelId: string) { return axios.delete(`${API_URL}/users/${userId}/favorites/${channelId}`); }
```

- Hook React Query (GET)
```ts
import { useQuery } from "@tanstack/react-query";
import { fetchChannels } from "./iptvService";

export function useChannels() {
  return useQuery(["channels"], fetchChannels, { staleTime: 1000 * 60 * 2, retry: 2 });
}
```

- Mutation avec optimistic update (exemple toggle favori)
```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFavorite, deleteFavorite } from "./iptvService";

function useToggleFavorite(userId: string) {
  const qc = useQueryClient();

  return useMutation(
    async ({ id, add }: { id: string; add: boolean }) => {
      if (add) return postFavorite(userId, id);
      return deleteFavorite(userId, id);
    },
    {
      onMutate: async ({ id, add }) => {
        await qc.cancelQueries(["favorites", userId]);
        const previous = qc.getQueryData<string[]>(["favorites", userId]) ?? [];
        qc.setQueryData(["favorites", userId], prev => add ? [...(prev ?? []), id] : (prev ?? []).filter(x => x !== id));
        return { previous };
      },
      onError: (_err, _variables, context: any) => {
        if (context?.previous) qc.setQueryData(["favorites", userId], context.previous);
      },
      onSettled: () => {
        qc.invalidateQueries(["favorites", userId]);
      },
    }
  );
}
```

- Persistance locale (AsyncStorage)
```ts
import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "mondiali:favorites";
export async function saveFavorites(ids: string[]) { await AsyncStorage.setItem(KEY, JSON.stringify(ids)); }
export async function loadFavorites(): Promise<string[]> { const raw = await AsyncStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; }
```

7) Checklist production (avant publication)
-------------------------------------------
- [ ] Vérifier licences et droits d'utilisation des flux HLS.
- [ ] Sécuriser les tokens (SecureStore), ajouter Sentry.
- [ ] Mettre en place CI (lint, tests, build).
- [ ] Tester playback HLS sur appareils réels (iOS & Android).
- [ ] Activer HTTPS sur l'API, config CORS restrictive.
- [ ] Optimiser bundle (lazy-load images, compression).
- [ ] Préparer assets store (icônes, splash, screenshots).
- [ ] Processus de publication (EAS / App Store / Play Store) prêt.
- [ ] Plan de monitoring & rollback après release.

8) CI / déploiement (notes rapides)
-----------------------------------
- Utiliser GitHub Actions : jobs pour lint → build → tests. Job release : EAS build + upload.
- Backend : hébergement sur provider managé (Supabase, Railway, Fly) ou Kubernetes selon charge.
- Sauvegarde DB & monitoring (logs, alertes).

9) FAQ & dépannage
-------------------
- L'app ne démarre pas : supprimer node_modules, lockfile, réinstaller et redémarrer `expo start`.
- Flux ne lit pas : tester l'URL HLS dans Safari/Chrome, vérifier CORS/HTTPS et codecs.
- Favoris non sauvegardés : vérifier appel à AsyncStorage et permissions de stockage si plateforme le requiert.

10) Support & contributions
---------------------------
- Fork → feature branch → PR vers `main`.
- Respecter lint/typechecks et ajouter tests.
- Pour intégration backend clé en main, je peux générer : Express + Prisma + Docker Compose + seed + scripts de migration.

---

Si vous voulez, j'ajoute ces fichiers directement au dépôt, ou je génère :
- Le backend complet (Express + Prisma + seed + Docker Compose),
- Les hooks React Query complets (mutations, invalidations, optimistic updates),
- Un workflow GitHub Actions prêt à l'emploi (CI + EAS).
Dites-moi ce que vous préférez que je produise ensuite.
