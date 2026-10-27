<p align="center"><img src="public/brand/mark.svg" alt="ValueChain Connect" width="72" height="72"></p>

<h1 align="center">🌍 ValueChain Connect</h1>

> La marketplace B2B qui connecte producteurs et transformateurs en Afrique de l'Ouest.

[![Status](https://img.shields.io/badge/Status-En%20d%C3%A9veloppement-blue)](https://valuechain-connect.vercel.app)
[![Part of FORGE Afrika](https://img.shields.io/badge/FORGE%20Afrika-Ecosystem-D4AF37)](https://github.com/dosteeve2-hash/forge-afrika)
[![Demo](https://img.shields.io/badge/Demo-Voir%20live-D4AF37?style=for-the-badge)](https://valuechain-connect.vercel.app)

## 🌍 Demo Live

**Site en ligne (aperçu) :** https://valuechain-connect.vercel.app. Le prototype affiche des données de démonstration ; aucune transaction réelle n'est proposée.

> Marketplace B2B connectant producteurs et transformateurs en Afrique de l'Ouest — CEDEAO

## 🎯 Problème résolu

Les producteurs (coton, sésame, karité, maïs) vendent à des intermédiaires à bas prix. Les transformateurs achètent à ces mêmes intermédiaires à prix fort. La marge d'intermédiation est capturée par des acteurs qui n'ajoutent pas de valeur. Les deux côtés perdent.

## 💡 Solution

ValueChain Connect est la plateforme B2B qui permet à :
- **Producteurs** de lister leurs matières premières avec prix, qualité, certifications, photos
- **Transformateurs** de sourcer directement avec filtres avancés
- **Coopératives** de grouper des offres pour atteindre les volumes requis
- **Exportateurs** d'accéder à des fournisseurs certifiés

## 🎯 Cible

Zone CEDEAO — Burkina Faso, Côte d'Ivoire, Sénégal, Ghana, Mali.

## 🖥️ Fonctionnalités prévues

État actuel : des écrans de prototype (catalogue, devis, matching, livraisons, tableau de bord) alimentés par des données de démonstration. Rien ci-dessous n'est opérationnel avec de vraies données.

| Module | Description |
|--------|-------------|
| Catalogue | Listings matières premières avec photos, qualité, prix |
| Recherche | Filtres par produit, région, certification, prix |
| Devis | Système de demande et envoi de devis |
| Transactions | Gestion des commandes et paiements |
| Réputation | Système d'avis acheteurs/vendeurs |
| Logistique | Coordination transport et traçabilité |

## 🛠️ Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (client d'authentification en place ; les écrans lisent aujourd'hui des données de démonstration, pas de base de données connectée)
- Composants Radix UI + Framer Motion
- Vercel
- Prévu, pas encore intégré : Supabase Realtime et Storage, paiements (Stripe ou CinetPay pour la zone CEDEAO) : aucun paiement n'est traité

## 🌍 Écosystème FORGE Afrika

ValueChain Connect est la **clé de voûte** de l'écosystème [FORGE Afrika](https://github.com/dosteeve2-hash/forge-afrika) — c'est là que la valeur créée par les autres produits est censée se monétiser (objectif, pas encore réalisé).

**Produits qui devraient alimenter la plateforme (aucune intégration n'existe encore) :**
- [AgroTrack BF](https://github.com/dosteeve2-hash/agrotrack-bf) — Coopératives listant leur production
- [MillTrack](https://github.com/dosteeve2-hash/milltrack) — Transformateurs cherchant des intrants (TAAMA est devenu le module Qualité de MillTrack)
- [Livestock](https://github.com/dosteeve2-hash/livestock-os) — Éleveurs vendant leur cheptel

## 🚀 Roadmap

- [ ] Phase 1 : Catalogue + recherche
- [ ] Phase 2 : Système de devis
- [ ] Phase 3 : Transactions + paiements
- [ ] Phase 4 : Logistique + traçabilité certifications

## 📬 Contact

**Steve Donald Compaore** — Fondateur FORGE Afrika
docompaore2@gmail.com
