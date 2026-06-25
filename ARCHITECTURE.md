# Architecture — Mondiali IPTV (expo-app)

Résumé
-------
Application mobile multiplateforme (iOS / Android / Web) construite avec Expo + React Native + Expo Router. L'UI est organisée en routes/pages (app/). La logique réseau et de données est encapsulée dans des services (expo/app/services) et exposée aux composants via React Query et des contextes locaux (FavoritesContext). La persistance locale légère utilise AsyncStorage ; la synchronisation distante peut s'effectuer via une API REST.

Stack
-----
- Langage : TypeScript (React Native)
- Framework / runtime : Expo (avec expo-router)
- State & data fetching :
  - @tanstack/react-query (gestion des requêtes et cache)
  - zustand (store léger, présent dans package.json)
  - AsyncStorage (@react-native-async-storage/async-storage) pour persistance locale
- Notable libraries :
  - expo-video / react-native-video (lecture vidéo)
  - lucide-react-native (icônes)
  - @rork-ai/toolkit-sdk (présent dans package.json, usage spécifique au projet)

Arborescence (fichiers et dossiers pertinents)
----------------------------------------------
```
expo/
  app/                       # Pages et layout expo-router (routes)
    _layout.tsx               # Root layout — QueryClientProvider, Providers, navigation stack
    (tabs)/                   # Écran principal sous forme d'onglets
    player.tsx                # Écran de player vidéo
    modal.tsx                 # Modal partagé
    match/[id]                # Page de détail d'un match
    components/               # Composants réutilisables (ChannelCard, MatchCard, LiveIndicator)
    services/                 # Clients / services réseau (iptvService.ts)
    data/                     # Données statiques (matches.ts, teams.ts)
    contexts/                 # Contextes React (FavoritesContext)
  app.json                    # Configuration Expo
  package.json                # scripts & dépendances
  tsconfig.json               # TypeScript config
  README.md                   # Documentation spécifique expo/
rork.json                     # configuration spécifique (présent à la racine)
LICENSE
.gitignore
```

Comment ça s'assemble (flux d'exécution)
---------------------------------------
1. Le point d'entrée d'Expo initialise le QueryClient (React Query) et les providers dans `expo/app/_layout.tsx`.
2. Les routes (expo-router) affichent les écrans. Les composants de liste (ChannelCard, MatchCard) appellent des hooks/services pour récupérer/mettre à jour les données.
3. Les services (ex. `iptvService.ts`) encapsulent les appels réseau (API REST / endpoints M3U / JSON). React Query garde le cache et rafraîchit.
4. La persistance locale (AsyncStorage) est utilisée pour stocker les favoris et états rapidement disponibles hors-ligne ; synchronisation optionnelle avec un backend distant via endpoints REST.
5. Le lecteur vidéo (player.tsx) consomme les flux renvoyés par `iptvService` (URL HLS, etc.) et affiche le contenu en modal ou écran plein.

Diagramme de flux (simplifié)
-----------------------------
```mermaid
flowchart LR
  A[UI — Écrans / Composants] -->|useQuery / call| B[React Query]
  B -->|utilise| C[Services réseau (iptvService)]
  C --> D[API distante / Flux M3U / Backend]
  B -->|cache| E[AsyncStorage (favorites) / zustand]
  E -->|synchronisation| D
  A -->|ouvre| F[Player vidéo]
  F -->|lit| C
```

Points techniques notables
--------------------------
- Expo Router est utilisé pour la structure des pages/routes.
- React Query gère le caching et la logique de revalidation.
- Le code contient des fichiers de données statiques (expo/app/data) utiles pour développement / démo.
- Le projet est prêt pour développement local via `expo start` (scripts package.json).
