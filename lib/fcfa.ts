/**
 * Formatage des montants en francs CFA.
 *
 * Cinq fichiers portaient la meme fonction `fmt` copiee-collee. Elle vit ici,
 * une fois, avec deux regles que la copie ne respectait pas.
 *
 * **Le XOF n'a pas de sous-unite.** Aucun montant ne s'affiche avec des
 * decimales : `10.5 * 333` valait « 3 496,5 FCFA », ce qui ne veut rien dire au
 * guichet. On arrondit a l'entier.
 *
 * **Un montant incalculable ne s'affiche pas comme un montant.** Le total d'un
 * devis se calculait depuis deux champs de saisie ; une valeur non numerique
 * donnait « NaN FCFA » a l'ecran. Elle donne desormais un tiret.
 */

const FR = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })

/** Un nombre, sans unite — quand le libelle porte deja « FCFA » ou « kg ». */
export function formatNombre(n: number): string {
  return Number.isFinite(n) ? FR.format(Math.round(n)) : '—'
}

/** Un montant en francs CFA, unite comprise. */
export function formatFCFA(n: number): string {
  return Number.isFinite(n) ? `${FR.format(Math.round(n))} FCFA` : '— FCFA'
}

/**
 * Lit un montant saisi au clavier.
 *
 * Un utilisateur francophone tape « 12,5 », pas « 12.5 ». `Number('12,5')`
 * vaut NaN — c'est ce qui affichait « NaN FCFA » dans le total d'un devis.
 * Les espaces (dont l'espace insecable fine que produit un copier-coller
 * depuis un montant deja formate) sont egalement acceptes.
 *
 * Rend `null` quand la saisie n'est pas un nombre : l'appelant decide quoi
 * afficher, plutot que de recevoir un NaN qui se propage en silence.
 */
export function parseMontant(saisie: string): number | null {
  const nettoye = saisie.replace(/[\s  ]/g, '').replace(',', '.')
  if (nettoye === '') return null
  const n = Number(nettoye)
  return Number.isFinite(n) ? n : null
}
