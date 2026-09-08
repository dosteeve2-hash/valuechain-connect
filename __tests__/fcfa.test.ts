/**
 * Suite de tests Vitest — formatage des montants en francs CFA
 *
 * Ces trois fonctions remplacent cinq copies de `n.toLocaleString('fr') + ' FCFA'`
 * reparties dans le dossier `app`. Les cas ci-dessous sont ceux que la version
 * copiee-collee traitait mal, et qui se voyaient a l'ecran.
 */
import { describe, it, expect } from 'vitest'
import { formatFCFA, formatNombre, parseMontant } from '../lib/fcfa'

describe('formatFCFA', () => {
  it('formate un entier a la francaise, avec l’unite', () => {
    // L'espace de groupement de fr-FR est une espace insecable etroite (U+202F),
    // pas une espace ordinaire : comparer avec ' ' echouerait.
    expect(formatFCFA(1234567)).toBe('1 234 567 FCFA')
  })

  it('n’affiche jamais de decimales — le XOF n’a pas de sous-unite', () => {
    expect(formatFCFA(3496.5)).toBe('3 497 FCFA')
    expect(formatFCFA(1250.4)).toBe('1 250 FCFA')
  })

  it('rend un tiret plutot que « NaN FCFA »', () => {
    expect(formatFCFA(Number.NaN)).toBe('— FCFA')
    expect(formatFCFA(Number.POSITIVE_INFINITY)).toBe('— FCFA')
  })

  it('accepte zero et les montants negatifs', () => {
    expect(formatFCFA(0)).toBe('0 FCFA')
    expect(formatFCFA(-2500)).toBe('-2 500 FCFA')
  })
})

describe('formatNombre', () => {
  it('formate sans unite, pour les libelles qui la portent deja', () => {
    expect(formatNombre(45000)).toBe('45 000')
  })

  it('rend un tiret sur une valeur non finie', () => {
    expect(formatNombre(Number.NaN)).toBe('—')
  })
})

describe('parseMontant', () => {
  it('accepte la virgule decimale francaise', () => {
    // C'est le defaut d'origine : `Number('12,5')` vaut NaN, et le total d'un
    // devis affichait « NaN FCFA » des qu'un utilisateur tapait une virgule.
    expect(parseMontant('12,5')).toBe(12.5)
  })

  it('accepte aussi le point', () => {
    expect(parseMontant('12.5')).toBe(12.5)
  })

  it('tolere les espaces, y compris ceux d’un copier-coller de montant formate', () => {
    expect(parseMontant('1 234')).toBe(1234)
    expect(parseMontant('1 234')).toBe(1234)
  })

  it('rend null sur une saisie non numerique', () => {
    expect(parseMontant('abc')).toBeNull()
    expect(parseMontant('')).toBeNull()
    expect(parseMontant('   ')).toBeNull()
  })

  it('rend null plutot que zero — un montant invalide n’est pas un montant nul', () => {
    // Le piege que ce contrat evite : `Number('abc') * 450` vaut NaN, mais
    // `null * 450` vaut 0. L'appelant doit tester null, jamais multiplier.
    const q = parseMontant('abc')
    expect(q).toBeNull()
    expect(q === null ? null : q * 450).toBeNull()
  })

  it('reconstitue le total d’un devis a partir de deux champs saisis', () => {
    const q = parseMontant('12,5')
    const p = parseMontant('450')
    expect(q !== null && p !== null ? formatFCFA(q * p) : '—').toBe('5 625 FCFA')
  })
})
