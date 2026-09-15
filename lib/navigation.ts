/**
 * Logique de navigation du tableau de bord — sans React, pour être vérifiable
 * sans navigateur ni moteur de rendu.
 */

export type EntreeNav = { href: string; label: string }

/**
 * Le menu compte onze entrées et `/dashboard` est le préfixe de six d'entre elles
 * (`/dashboard/commandes`, `/dashboard/profil`…). Le comparer en `startsWith`
 * l'allumerait donc sur toutes ces pages en même temps.
 *
 * `/dashboard` n'est actif qu'en correspondance EXACTE. Les autres entrées acceptent
 * leurs sous-routes, mais sur une frontière de segment : `/devis` ne doit pas
 * s'allumer sur `/devis-archives`.
 */
export function estActif(href: string, chemin: string): boolean {
  if (href === '/dashboard') return chemin === '/dashboard'
  return chemin === href || chemin.startsWith(href + '/')
}
