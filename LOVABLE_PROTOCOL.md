# AgroLink — Lovable Protocol

## Vision
AgroLink est la clé de voûte de l'écosystème FORGE Afrika : la marketplace B2B qui élimine les intermédiaires entre producteurs (coton, sésame, karité, maïs) et transformateurs en Afrique de l'Ouest CEDEAO. Producteurs vendent au juste prix, transformateurs s'approvisionnent directement — la valeur reste dans l'écosystème africain.

## URL de production
https://valuechain-connect.vercel.app

## Utilisateurs cibles
- **Persona 1 — Awa, Présidente coopérative sésame (Kaya, Burkina Faso)** : 180 tonnes de sésame/saison. Vend à des intermédiaires qui prennent 30% de marge. Besoin : lister directement sa production, recevoir des offres d'achat, négocier sans intermédiaire.
- **Persona 2 — Lassana, Directeur huilerie (Bobo-Dioulasso)** : Cherche 50 tonnes sésame certifié Bio/mois. Besoin : trouver des fournisseurs fiables, comparer qualités/prix, passer commandes récurrentes.
- **Persona 3 — Ibrahim, Exportateur agréé (Ouagadougou)** : Achète pour revendre à l'export. Besoin : accéder aux lots certifiés Fairtrade avec traçabilité, évaluer la réputation des coopératives fournisseurs.

## Fonctionnalités core
### P0 (MVP live)
- Catalogue listings matières premières (photos, qualité, prix, certification, région)
- Recherche avancée (produit, région, certification, prix min/max, volume min)
- Profils vendeurs (coopératives, producteurs individuels) avec réputation
- Profils acheteurs (transformateurs, exportateurs, négociants)
- Système de devis (demande acheteur → réponse vendeur → contre-offre)
- Gestion commandes et transactions
- Système d'avis vérifiés acheteurs/vendeurs
- Coordination logistique de base

### P1 (prochaine itération)
- Auth Supabase multi-rôles (Producteur / Coopérative / Transformateur / Exportateur / Admin)
- Intégration AgroTrack BF (coopératives listent automatiquement leur production)
- Intégration MillTrack (transformateurs publient leurs besoins d'intrants)
- Paiements sécurisés (Stripe + CinetPay/FedaPay UEMOA) avec séquestre
- Messagerie in-app acheteur/vendeur (négociation temps réel)
- Notifications Supabase Realtime (nouvelle offre, contre-offre, commande)

### P2 (roadmap)
- Traçabilité certifications (Bio, Fairtrade, Rainforest Alliance) avec QR codes
- Coordination transport (opérateurs logistique UEMOA intégrés)
- Groupage offres coopératives (atteindre volumes minimaux acheteurs)
- Expansion LivestockOS (cheptel bovin, ovin)
- Reporting impact (volumes échangés, revenus générés, intermédiaires éliminés)

## Design System
- **Couleurs** : Navy `#0A1628`, Gold `#D4AF37`, Cyan `#00BCD4`
- **Typographie** : Inter / Geist
- **Animations** : Framer Motion v12 (fadeInUp listings, hoverScale cards)
- **Composants** : Radix UI (Select, Label, Slot)
- **Icônes** : Lucide React
- **Charts** : Recharts (volumes échangés, prix marché)

## Stack Technique
- **Frontend** : Next.js 15 (App Router), React 19, TypeScript
- **Styles** : Tailwind CSS v3, tailwindcss-animate
- **Animations** : Framer Motion v12
- **Backend** : Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Composants** : Radix UI
- **Charts** : Recharts
- **Paiements** : Stripe (international) + CinetPay (UEMOA)
- **Déploiement** : Vercel

## Modèle de données

### Table `listings`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| seller_id | uuid | FK users |
| product_type | text | sesame / coton / karite / mais / arachide |
| quantity_tonnes | numeric | Volume disponible |
| price_per_tonne | numeric | Prix/tonne FCFA |
| quality_grade | text | A / B / C / Extra |
| certifications | text[] | Bio / Fairtrade / aucune |
| region | text | Région Burkina Faso / pays |
| available_from | date | Disponibilité |
| images | text[] | URLs Supabase Storage |

### Table `rfq_requests`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| listing_id | uuid | FK listings |
| buyer_id | uuid | FK users |
| quantity_requested | numeric | Tonnes demandées |
| price_offered | numeric | Prix offert/tonne |
| message | text | Message acheteur |
| status | enum | en_attente / accepte / refuse / contre_offre |

### Table `transactions`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| rfq_id | uuid | FK rfq_requests |
| amount_fcfa | numeric | Montant total |
| payment_status | enum | en_attente / paye / litige |
| escrow_released | boolean | Fonds libérés vendeur |
| completed_at | timestamp | Date finalisation |

## Flux utilisateur clé — Acheteur sourcer du sésame Bio

1. Lassana se connecte → Dashboard acheteur → "Trouver matières premières"
2. Filtre : Sésame + Grade A + Certification Bio + Burkina Faso + prix < 450 FCFA/kg
3. Résultats : 3 coopératives disponibles → consulte profil coopérative Kaya (note 4.8★)
4. Clique "Demander devis" → saisit 50 tonnes, offre 420 FCFA/kg, message
5. Awa (coopérative) reçoit notification → accepte à 430 FCFA/kg (contre-offre)
6. Lassana accepte → contrat auto-généré → paiement séquestre CinetPay
7. Livraison confirmée → séquestre libéré → Awa reçoit le paiement
8. Lassana laisse avis 5★ → score coopérative mis à jour

## Critères de succès
- Listing créé en < 5 minutes (producteur non technique)
- Résultats de recherche en < 1 seconde (Supabase full-text + index)
- Cycle devis → contre-offre → acceptation en < 24h (notifications temps réel)
- Zéro erreur `npm run build`
- Score Lighthouse Performance > 85
- Zone CEDEAO couverte dès le lancement (5 pays)

---
*Lovable Protocol v1.0 — FORGE Afrika © 2025 — Steeve Donald Compaore*
