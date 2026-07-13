# ValueChain Connect — Instructions Claude

## Stack
- Next.js 15 App Router + TypeScript strict (0 `any`)
- Supabase SSR : TOUJOURS `getUser()`, JAMAIS `getSession()`
- Framer Motion : `type: 'spring' as const`
- Charte : Navy #0A1628, Gold #D4AF37, Cyan #00BCD4

## Règles obligatoires
- Pub/sub Supabase Realtime — JAMAIS de polling
- `npm run build` 0 erreurs avant chaque push
- Co-authored-by: Claude <claude@anthropic.com> dans chaque commit

## Contexte produit
Marketplace B2B zone CEDEAO. 2 rôles : Vendeur (producteur/coopérative) et Acheteur (transformateur/exportateur).
