# PRD — AgroLink

## Résumé exécutif
AgroLink est la marketplace B2B qui connecte producteurs (coopératives, éleveurs, agriculteurs) et transformateurs/exportateurs en Afrique de l'Ouest — zone CEDEAO. C'est la "clé de voûte" de l'écosystème FORGE Afrika : tous les autres produits (AgroTrack BF, MillTrack, LivestockOS, TAAMA) produisent de la valeur qu'AgroLink monétise en la connectant à des acheteurs. Deux rôles : Vendeur (producteur/coopérative) et Acheteur (transformateur/exportateur).

## Motivation originale
> "Marketplace B2B zone CEDEAO. 2 rôles : Vendeur (producteur/coopérative) et Acheteur (transformateur/exportateur)."
> — Contexte produit issu de CLAUDE.md

Les producteurs (coton, sésame, karité, maïs, bétail) vendent à des intermédiaires à bas prix. Les transformateurs achètent à ces mêmes intermédiaires à prix fort. La marge d'intermédiation est capturée par des acteurs qui n'ajoutent pas de valeur. Les deux côtés perdent. AgroLink court-circuite ces intermédiaires.

## Vision et ambition
Être l'"Alibaba des matières premières agricoles et industrielles africaines" — la plateforme de référence pour le commerce B2B intrarégional en Afrique de l'Ouest. L'ambition à terme : que tout transformateur cherchant du sésame au Burkina Faso ou de l'anacarde en Côte d'Ivoire passe par AgroLink. La plateforme capture une commission sur chaque transaction et les données de flux commerciaux deviennent elles-mêmes un actif stratégique.

## Problème résolu
1. **Asymétrie d'information** — les producteurs ne connaissent pas les prix de marché des acheteurs ; les acheteurs ne savent pas qui produit quoi où.
2. **Intermédiaires parasitaires** — la marge de 30-50% capturée par les intermédiaires réduit le revenu des producteurs et le profit des transformateurs.
3. **Pas de certification accessible** — les acheteurs formels exigent des garanties de qualité et d'origine que les petits producteurs ne peuvent pas fournir seuls.
4. **Fragmentation** — chaque filière (coton, sésame, karité) a ses propres réseaux cloisonnés ; aucune plateforme transversale n'existe.

## Utilisateurs cibles
### Vendeurs (côté offre)
- Coopératives agricoles (coton, sésame, karité, maïs, riz)
- Éleveurs semi-industriels (bétail, lait, œufs)
- Groupements de producteurs
- Artisans et transformateurs artisanaux

### Acheteurs (côté demande)
- Minoteries et huileries (cherchent des intrants en volume)
- Exportateurs CEDEAO et internationaux
- Supermarchés et chaînes de distribution
- Brasseries, laiteries, chocolateries industrielles

## Fonctionnalités clés (MVP)

### Catalogue / Listings
- Fiche produit : matière première, quantité disponible, qualité, certifications, photos, prix (fixe ou sur devis)
- Géolocalisation du stock (région/ville)
- Filtres avancés (produit, région, certification, prix, quantité minimale)

### Système de devis
- Demande de devis entre acheteur et vendeur
- Messagerie intégrée pour négociation
- Expiration automatique des offres

### Transactions
- Gestion des commandes (confirmation, logistique, livraison)
- Paiements : CinetPay (zone CEDEAO), Orange Money Business, Wave Business
- Escrow léger (paiement bloqué jusqu'à confirmation de livraison)

### Réputation & Confiance
- Système d'avis acheteurs/vendeurs
- Score de fiabilité (% livraisons conformes)
- Badge certifié (connecté AgroTrack BF / MillTrack / LivestockOS)

### Logistique
- Coordination transport (partenaires transporteurs)
- Suivi livraison
- Documents de transport automatiques

## Stack technique
```
Frontend    Next.js 15 (App Router) + TypeScript strict + Tailwind CSS
UI          shadcn/ui + Framer Motion (spring animations)
Auth/DB     Supabase SSR + PostgreSQL + Realtime + Storage (photos produits)
Paiements   CinetPay + Orange Money Business + Wave Business
Déploiement Vercel
Charte      Navy #0A1628, Gold #D4AF37, Cyan #00BCD4
```

## Intégration écosystème FORGE Afrika
AgroLink est le **point de convergence** de tout l'écosystème :
- **AgroTrack BF → AgroLink** : les coopératives listent automatiquement leur production disponible
- **MillTrack → AgroLink** : les transformateurs cherchent leurs intrants et listent leurs produits finis
- **LivestockOS → AgroLink** : les éleveurs vendent animaux et produits animaux (lait, œufs)
- **TAAMA → AgroLink** : les PMEs TAAMA sourcent et vendent via la plateforme
- **FORGE Afrika HQ** : les métriques de transactions (volume, valeur, pays) remontent au dashboard groupe comme indicateur phare de l'impact de l'écosystème

## Feuille de route
### Phase 1 — Catalogue + recherche
Listings basiques, filtres, profils vendeurs/acheteurs. Gratuit pour les 6 premiers mois (acquisition).

### Phase 2 — Système de devis
Messagerie, devis, expiration, négociation structurée.

### Phase 3 — Transactions + paiements
CinetPay / OM Business / Wave Business, escrow, commissions (2-5% par transaction).

### Phase 4 — Logistique + traçabilité certifications
Partenaires transporteurs, tracking livraison, documents certifiés.

## Métriques de succès
- Nombre de vendeurs actifs (cible Phase 1 : 50 vendeurs)
- Nombre d'acheteurs actifs (cible Phase 1 : 20 acheteurs)
- Volume de transactions (GMV) par mois (cible Phase 3 début : 10M FCFA/mois)
- Commission prélevée (MRR cible Phase 3 : 500 000 FCFA/mois)
- Pays actifs (cible Phase 2 : BF + CI + SN)
- % de transactions avec certification de qualité (cible > 60%)

## Contraintes et décisions clés
- **Multi-tenant strict** — vendeurs et acheteurs ont des dashboards séparés et des vues de données isolées ; RLS Supabase obligatoire
- **Confiance avant volume** — la plateforme ne décolle que si les deux côtés se font confiance ; le système de réputation et les badges certifiés (connectés aux autres produits FORGE) sont prioritaires
- **Pub/sub Realtime** — les notifications de devis et de nouvelles offres doivent être instantanées, jamais de polling
- **Conformité UEMOA/CEDEAO** — les transactions transfrontalières impliquent des règles douanières et financières spécifiques à documenter par pays en Phase 3
- **Mobile-first** — acheteurs et vendeurs utilisent principalement des smartphones ; pas d'hypothèse desktop

---
*PRD rédigé par Claude (COO) sur instruction de Steve Donald Compaore (PDG FORGE Afrika)*
*Dernière mise à jour : 2026-07-25*
