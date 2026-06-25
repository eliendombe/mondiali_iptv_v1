# Documentation générale — Mondiali IPTV (FR)

But et audience
--------------
Application consommateur pour parcourir chaînes/matchs IPTV, marquer favoris et lire des flux HLS. Destinée aux développeurs mobile souhaitant déployer / adapter l'app ou intégrer un backend de persistance.

Composants fonctionnels
-----------------------
- UI / Navigation : expo-router (app/)
- Gestion données : React Query pour fetch/caching, zustand pour petits états locaux
- Services : iptvService encapsule accès aux sources (JSON, M3U, endpoints)
- Persistance : AsyncStorage pour favoris (synchronisation possible)
- Player : écran/modal spécialisé pour lire HLS

Endpoints backend recommandés (contract)
---------------------------------------
- GET /channels
  - réponse: [{ id, name, logo, category, streams: [{ quality, url }], isLive }]
- GET /channels/:id
  - détail d'une chaîne / match
- GET /users/:id/favorites
  - retourne listes d'ids favoris
- POST /users/:id/favorites { channelId }
  - ajoute favori
- DELETE /users/:id/favorites/:channelId
  - supprime favori

Exemples d'usage (résumé)
-------------------------
- Développement local : utiliser fixtures (expo/app/data/*.ts) pour simuler /channels.
- Production : fournir un backend stable (Postgres, Supabase ou Firebase) et configurer API_URL.

Architecture offline-first
--------------------------
- Charger d'abord fixtures ou cache React Query.
- Afficher contenu et permettre marquage favori local (AsyncStorage).
- Quand online, synchroniser favoris vers backend (idempotence requise).

Sécurité & vie privée
---------------------
- Ne stocker aucune authentification sensible dans AsyncStorage.
- Utiliser TLS (HTTPS) pour toutes les requêtes.
- Respecter les droits et licences des flux. Documenter provenance des flux.

Bonnes pratiques et style
------------------------
- Tous les fetchs passent par services/ (centralisation, tests).
- Mutations React Query avec optimistic updates pour UX fluide.
- Tests manuels sur dispositifs réels (iOS, Android) pour la lecture HLS et gestion d'arrière-plan.

Fichiers importants (rapide)
----------------------------
- expo/app/_layout.tsx
- expo/app/services/iptvService.ts
- expo/app/components/ChannelCard.tsx, MatchCard.tsx
- expo/app/data/matches.ts, teams.ts
- expo/package.json

Prochaine étape recommandée
--------------------------
- Si vous voulez, je peux générer un backend d'exemple complet (Express + Prisma) + Docker Compose + script seed, et fournir des hooks React Query prêts à l'emploi pour l'intégration.
