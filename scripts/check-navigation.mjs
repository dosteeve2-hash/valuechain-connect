#!/usr/bin/env node
/**
 * check-navigation.mjs — vérifie la logique du lien actif du tableau de bord.
 *
 * Pourquoi ce script existe : le menu compte onze entrées et `/dashboard` est le
 * préfixe de six d'entre elles. Une comparaison naïve en `startsWith` allume
 * « Tableau de bord » sur Commandes, Contrats, Messages, Mes offres et Profil à la
 * fois — un menu qui prétend qu'on est sur cinq pages en même temps ne sert plus à
 * rien. Le défaut est invisible à la lecture du diff et évident à l'exécution.
 *
 * Node pur, aucune dépendance : le dépôt n'a pas de lanceur de tests sur son tronc.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const racine = join(dirname(fileURLToPath(import.meta.url)), '..')

// `lib/navigation.ts` est du TypeScript sans dépendance : on en retire les annotations
// pour l'évaluer, plutôt que d'ajouter un compilateur pour dix lignes.
const source = readFileSync(join(racine, 'lib/navigation.ts'), 'utf8')
const corps = source
  .replace(/export type[\s\S]*?\n\n/g, '')
  .replace(/export function estActif\(href: string, chemin: string\): boolean/, 'function estActif(href, chemin)')
  .replace(/^export /gm, '')
const estActif = new Function(`${corps}; return estActif`)()

const cas = [
  // [href, chemin, attendu, pourquoi]
  ['/dashboard', '/dashboard', true, 'la page elle-même'],
  ['/dashboard', '/dashboard/commandes', false, "LE PIÈGE : /dashboard ne doit PAS s'allumer sur ses sous-pages"],
  ['/dashboard', '/dashboard/profil', false, 'idem'],
  ['/dashboard', '/dashboard/messages', false, 'idem'],
  ['/dashboard/commandes', '/dashboard/commandes', true, 'correspondance exacte'],
  ['/dashboard/commandes', '/dashboard/commandes/42', true, 'une sous-route allume son parent'],
  ['/devis', '/devis', true, 'correspondance exacte'],
  ['/devis', '/devis/nouveau', true, 'sous-route'],
  ['/devis', '/devis-archives', false, "frontière de segment : /devis ne s'allume pas sur /devis-archives"],
  ['/produits', '/catalogue', false, 'aucun rapport'],
  ['/matching', '/', false, "la racine n'allume rien"],
  ['/catalogue', '', false, 'chemin vide (usePathname peut renvoyer null au premier rendu)'],
]

let echecs = 0
for (const [href, chemin, attendu, pourquoi] of cas) {
  const obtenu = estActif(href, chemin)
  if (obtenu !== attendu) {
    echecs++
    console.error(`  ✗ estActif(${JSON.stringify(href)}, ${JSON.stringify(chemin)}) = ${obtenu}, attendu ${attendu}`)
    console.error(`     ${pourquoi}`)
  }
}

// Un chemin ne doit jamais allumer deux entrées du menu à la fois.
const HREFS = [
  '/dashboard', '/matching', '/catalogue', '/produits', '/livraisons',
  '/dashboard/mes-offres', '/devis', '/dashboard/commandes',
  '/dashboard/contrats', '/dashboard/messages', '/dashboard/profil',
]
for (const chemin of HREFS) {
  const allumees = HREFS.filter((h) => estActif(h, chemin))
  if (allumees.length !== 1) {
    echecs++
    console.error(`  ✗ ${chemin} allume ${allumees.length} entrées : ${allumees.join(', ')} — il en faut exactement 1`)
  }
}

if (echecs > 0) {
  console.error(`\n::error::check-navigation — ${echecs} cas en échec`)
  process.exit(1)
}
console.log(`✅ navigation : ${cas.length} cas + ${HREFS.length} chemins, une seule entrée allumée à chaque fois`)
