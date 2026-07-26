Set-Location "C:\Users\pc\Documents\GitHub\valuechain-connect"

# Build check
Write-Host "=== npm run build ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED! Aborting." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Git add
Write-Host "`n=== git add ===" -ForegroundColor Cyan
git add -A

# Git commit
Write-Host "`n=== git commit ===" -ForegroundColor Cyan
$commitMsg = @"
feat: ValueChain Connect v2 -- auth dual-role + commandes + profil + demo

- Auth Supabase avec 2 roles Producteur/Transformateur
- Register en 2 etapes avec selection role
- /commandes : suivi avec barre progression + incoterms
- /profil : page vendeur avec stats et certifications
- /mes-offres : gestion CRUD offres producteur
- /onboarding : guide adapte par role + mode demo
- vercel.json
- middleware.ts protection routes

Co-authored-by: Claude <claude@anthropic.com>
"@

git commit -m $commitMsg

# Git push
Write-Host "`n=== git push ===" -ForegroundColor Cyan
git push origin feat/v1-marketplace

# PR creation
Write-Host "`n=== gh pr create ===" -ForegroundColor Cyan
$prBody = @"
## ValueChain Connect v2

Auth avec 2 roles + toutes les pages marketplace.

### Nouveau
- Auth dual-role Producteur/Transformateur (login + register 2 etapes)
- /commandes suivi avec barre progression + incoterms
- /profil vendeur complet avec stats et certifications
- /mes-offres CRUD avec modal formulaire
- /onboarding guide adapte par role + banniere demo
- middleware.ts protection routes Supabase SSR
- vercel.json

Co-authored-by: Claude <claude@anthropic.com>
"@

gh pr create --title "feat: ValueChain v2 -- auth dual-role + commandes + profil + demo" --body $prBody --base main

Write-Host "`n=== DONE ===" -ForegroundColor Green
Read-Host "Press Enter to exit"
