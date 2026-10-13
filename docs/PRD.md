# PRD — AgroLink

## Vision

AgroLink est la clé de voûte de l'écosystème FORGE Afrika. C'est la marketplace B2B qui élimine les intermédiaires entre producteurs agricoles et transformateurs industriels en Afrique de l'Ouest (zone CEDEAO). Chaque produit FORGE Afrika génère des données qui alimentent AgroLink — c'est là que la valeur se monétise.

## Utilisateurs cibles

| Persona | Rôle | Besoin principal |
|---------|------|-----------------|
| Coopérative / Producteur | Vendeur | Lister sa production, trouver des acheteurs directs |
| Minoterie / Huilerie | Acheteur | Sourcer des matières premières de qualité certifiée |
| Exportateur | Acheteur | Accéder à des fournisseurs avec traçabilité |
| Éleveur (via LivestockOS) | Vendeur | Vendre son cheptel au prix marché |

## Problèmes validés

1. **Fragmentation** — vendeurs et acheteurs ne se trouvent pas sans intermédiaires
2. **Opacité des prix** — pas de référentiel de prix publics en zone CEDEAO
3. **Déficit de confiance** — pas de système de réputation inter-acteurs
4. **Volumétrie** — un producteur seul ne peut pas répondre aux volumes d'un transformateur

## Phase 1 — MVP (priorités)

### Fonctionnalités incluses

- [ ] Authentification avec 2 rôles : Vendeur et Acheteur
- [ ] Onboarding vendeur : profil entreprise/coopérative, pays, certifications
- [ ] Catalogue vendeur : création de listings (produit, quantité, prix/kg, photos, localisation)
- [ ] Recherche acheteur : filtres par produit, pays, prix min/max, disponibilité
- [ ] Page listing détaillée : toutes infos + bouton "Contacter le vendeur"
- [ ] Messagerie intégrée vendeur ↔ acheteur (Supabase Realtime)
- [ ] Dashboard vendeur : mes listings, vues reçues, messages
- [ ] Dashboard acheteur : recherches sauvegardées, messages

### Fonctionnalités exclues de la Phase 1

- Système de devis formalisé — Phase 2
- Gestion des commandes et paiements CinetPay/Stripe — Phase 3
- Système d'avis et réputation — Phase 3
- Module logistique et traçabilité — Phase 4
- Intégrations AgroTrack BF / MillTrack / LivestockOS — Phase 4

## Stack technique

- **Frontend** : Next.js 15 App Router + TypeScript strict + Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Realtime + Storage)
- **UI** : shadcn/ui + Framer Motion
- **Paiements** : CinetPay (CEDEAO) + Stripe (international) — Phase 3
- **Deploy** : Vercel
- **Emails** : Resend

## Modèle de données (Phase 1)

```
profiles
  id, user_id, role (vendeur|acheteur), nom_entreprise, pays, telephone, certifications[]

listings
  id, vendeur_id, produit, description, quantite_kg, prix_fcfa_kg,
  localisation, photos[], disponible_jusqu_au, statut (actif|vendu|expire)

messages
  id, listing_id, expediteur_id, destinataire_id, contenu, lu, created_at
```

## Métriques de succès Phase 1

- 15 vendeurs actifs (coopératives + producteurs) inscrits
- 10 acheteurs actifs (transformateurs + exportateurs) inscrits
- 30 listings publiés dans les 60 premiers jours
- 5 mises en relation aboutissant à un contact direct
- Temps moyen pour trouver un fournisseur < 10 minutes
