import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import CataloguePreview from '@/components/public-site/CataloguePreview'
import LotFlow from '@/components/public-site/LotFlow'
import PrimaryLink from '@/components/public-site/PrimaryLink'
import PublicSite from '@/components/public-site/PublicSite'
import Reveal from '@/components/public-site/Reveal'

export const metadata: Metadata = {
  title: 'ValueChain Connect | Du producteur au transformateur',
  description:
    'ValueChain Connect est un projet de place de marché B2B en conception pour rapprocher producteurs et transformateurs. Le prototype présente des données de démonstration.',
}

const materials = ['Coton', 'Sésame', 'Karité', 'Maïs']

export default function HomePage() {
  return (
    <PublicSite>
      <main id="contenu">
        <section className="vc-hero vc-container" aria-labelledby="vc-home-title">
          <Reveal className="vc-hero-copy">
            <p className="vc-eyebrow"><span /> Marché agricole B2B · en conception</p>
            <h1 id="vc-home-title" className="vc-display vc-hero-title">
              Vendez directement à <span>celui qui transforme.</span>
            </h1>
            <p className="vc-hero-lede">
              Un projet de place de marché pour rapprocher producteurs, coopératives et
              transformateurs autour des matières premières. Le prototype présente des données
              de démonstration, sans transaction réelle.
            </p>
            <div className="vc-hero-actions">
              <PrimaryLink />
            </div>
            <p className="vc-hero-note">Écrivez-nous pour manifester votre intérêt pour le pilote.</p>
          </Reveal>

          <Reveal className="vc-hero-visual" delay={0.12}>
            <figure className="vc-hero-photo">
              <Image
                src="/images/photos/industrie-coton.webp"
                alt="Balles de coton près d’un camion de transport."
                width={1600}
                height={1200}
                priority
                quality={75}
                sizes="(min-width: 1024px) 49vw, 100vw"
              />
              <figcaption className="vc-photo-caption">
                <span className="vc-photo-mark">
                  <Image src="/brand/mark.svg" alt="" width={44} height={44} />
                </span>
                <span>
                  <strong>ValueChain Connect</strong>
                  <small>Du champ à la transformation</small>
                </span>
              </figcaption>
              <span className="vc-photo-index" aria-hidden="true">01 / matière</span>
            </figure>
          </Reveal>
        </section>

        <section className="vc-material-band" aria-label="Matières premières citées dans le projet">
          <div className="vc-container vc-material-inner">
            <span className="vc-material-label">Matières du périmètre</span>
            <ul>
              {materials.map((material) => <li key={material}>{material}</li>)}
            </ul>
          </div>
        </section>

        <section className="vc-split-section" aria-labelledby="vc-split-title">
          <div className="vc-container vc-split-layout">
            <Reveal className="vc-split-copy">
              <p className="vc-eyebrow vc-eyebrow-light"><span /> Le geste de la marque</p>
              <h2 id="vc-split-title" className="vc-display vc-section-title">
                Un lot peut trouver plusieurs débouchés.
              </h2>
              <p>
                Le symbole ValueChain Connect raconte ce mouvement : une matière première part
                d’un producteur et se distribue vers des acteurs de transformation.
              </p>
              <p className="vc-soft-note">
                Le schéma est un exemple pédagogique. Il ne représente ni vendeur, ni acheteur,
                ni transaction réelle.
              </p>
            </Reveal>
            <Reveal className="vc-split-visual" delay={0.1}>
              <LotFlow />
            </Reveal>
          </div>
        </section>

        <section id="catalogue" className="vc-catalogue-section" aria-labelledby="vc-catalogue-title">
          <div className="vc-container">
            <Reveal className="vc-section-heading vc-catalogue-heading">
              <p className="vc-eyebrow"><span /> Recherche · aperçu interactif</p>
              <h2 id="vc-catalogue-title" className="vc-display vc-section-title">
                Trouver le bon lot commence par les bons filtres.
              </h2>
              <p>
                Cette scène met en mouvement trois critères de recherche. Les cartes sont
                illustratives et ne correspondent à aucune offre disponible.
              </p>
            </Reveal>
            <CataloguePreview />
          </div>
        </section>

        <section className="vc-prototype-section" aria-labelledby="vc-prototype-title">
          <div className="vc-container vc-prototype-grid">
            <Reveal className="vc-prototype-image-wrap">
              <figure className="vc-prototype-image">
                <Image
                  src="/images/photos/industrie-cereales.webp"
                  alt="Des personnes manipulent des céréales dans une cour de travail."
                  width={1600}
                  height={808}
                  quality={75}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
                <figcaption>Photo d’illustration · céréales</figcaption>
              </figure>
            </Reveal>
            <Reveal className="vc-prototype-copy" delay={0.1}>
              <p className="vc-eyebrow"><span /> Ce que montre le code</p>
              <h2 id="vc-prototype-title" className="vc-display vc-section-title">
                Une interface en aperçu, pas encore un marché actif.
              </h2>
              <p className="vc-prototype-intro">
                Le projet est en conception. Les parcours existants servent à illustrer le
                fonctionnement envisagé avec des données fictives.
              </p>
              <ul className="vc-feature-list">
                <li>
                  <span className="vc-feature-index">01</span>
                  <span><strong>Catalogue</strong><small>Des offres de démonstration pour visualiser les fiches de matières premières.</small></span>
                </li>
                <li>
                  <span className="vc-feature-index">02</span>
                  <span><strong>Recherche</strong><small>Recherche produit ou vendeur, catégorie, disponibilité et fourchette de prix.</small></span>
                </li>
                <li>
                  <span className="vc-feature-index">03</span>
                  <span><strong>Mise en relation</strong><small>Écrans de matching et formulaire de proposition en mode démonstration.</small></span>
                </li>
              </ul>
              <p className="vc-disclaimer">
                Les profils, prix et offres présents dans l’application sont des données de
                démonstration. Aucune transaction commerciale n’est proposée sur ce site.
              </p>
              <Link className="vc-text-link" href="/le-projet">Voir le périmètre du projet <span aria-hidden="true">↗</span></Link>
            </Reveal>
          </div>
        </section>

        <section className="vc-pilot-section" aria-labelledby="vc-pilot-title">
          <Reveal className="vc-container vc-pilot-inner">
            <div className="vc-pilot-mark" aria-hidden="true">
              <Image src="/brand/mark.svg" alt="" width={64} height={64} />
            </div>
            <p className="vc-eyebrow vc-eyebrow-light"><span /> Une idée à construire ensemble</p>
            <h2 id="vc-pilot-title" className="vc-display vc-pilot-title">
              Du producteur au transformateur, sans intermédiaire de trop.
            </h2>
            <p>
              Producteurs, coopératives et transformateurs peuvent nous écrire pour échanger sur
              le périmètre du pilote.
            </p>
            <PrimaryLink />
          </Reveal>
        </section>
      </main>
    </PublicSite>
  )
}
