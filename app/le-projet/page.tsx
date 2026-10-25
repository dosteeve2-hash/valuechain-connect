import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PrimaryLink from '@/components/public-site/PrimaryLink'
import PublicSite from '@/components/public-site/PublicSite'
import Reveal from '@/components/public-site/Reveal'

export const metadata: Metadata = {
  title: 'Le projet | ValueChain Connect',
  description:
    'Découvrez le périmètre réel de ValueChain Connect : un projet en conception et un prototype avec des données de démonstration.',
}

const parcours = [
  {
    index: '01',
    title: 'Un catalogue en aperçu',
    description:
      'Le dépôt contient des fiches de matières premières présentées avec des données de démonstration.',
  },
  {
    index: '02',
    title: 'Une recherche de prototype',
    description:
      'Le catalogue permet de chercher un produit ou un vendeur et de filtrer par catégorie, disponibilité et prix.',
  },
  {
    index: '03',
    title: 'Une mise en relation illustrée',
    description:
      'Un écran de matching présente des profils fictifs. Le formulaire de proposition est une interaction de démonstration.',
  },
]

export default function ProjectPage() {
  return (
    <PublicSite>
      <main id="contenu" className="vc-info-page">
        <section className="vc-page-intro vc-container">
          <Reveal>
            <p className="vc-eyebrow"><span /> À propos · état du projet</p>
            <h1 className="vc-display vc-page-title">Une chaîne plus lisible, du producteur à la transformation.</h1>
            <p className="vc-page-lede">
              ValueChain Connect est en conception. Le dépôt contient un prototype d’interface
              pour explorer une place de marché B2B autour de matières premières agricoles.
            </p>
            <span className="vc-status-pill">Projet en conception</span>
          </Reveal>
        </section>

        <section className="vc-project-feature">
          <div className="vc-container vc-project-grid">
            <Reveal className="vc-project-photo-wrap">
              <figure className="vc-project-photo">
                <Image
                  src="/images/photos/industrie-cereales.webp"
                  alt="Des personnes travaillent ensemble autour d’un tas de céréales."
                  width={1600}
                  height={808}
                  quality={75}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <figcaption>Illustration photographique · céréales</figcaption>
              </figure>
            </Reveal>
            <Reveal className="vc-project-copy" delay={0.1}>
              <p className="vc-eyebrow"><span /> La direction</p>
              <h2 className="vc-display vc-section-title">Rapprocher l’offre de ceux qui la transforment.</h2>
              <p>
                Le projet veut donner un point de rencontre commun aux producteurs, coopératives
                et transformateurs, avec une attention portée aux informations d’un lot et à la
                recherche d’un partenaire.
              </p>
              <p>
                Les matières citées dans le README sont le coton, le sésame, le karité et le maïs.
                Leur présence sur ce site décrit le périmètre envisagé, pas un stock disponible.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="vc-project-scope vc-container" aria-labelledby="vc-scope-title">
          <Reveal className="vc-section-heading">
            <p className="vc-eyebrow"><span /> Ce qui existe dans le dépôt</p>
            <h2 id="vc-scope-title" className="vc-display vc-section-title">Le prototype, sans raccourci.</h2>
          </Reveal>
          <div className="vc-project-steps">
            {parcours.map((item) => (
              <Reveal className="vc-project-step" key={item.index}>
                <span className="vc-feature-index">{item.index}</span>
                <div>
                  <span className="vc-step-state">Aperçu</span>
                  <h3 className="vc-display">{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="vc-disclaimer vc-project-disclaimer">
            Les offres, profils, prix, certifications et échanges présents dans l’application
            sont fictifs. Les formulaires actuels ne créent pas de transaction commerciale.
          </p>
        </section>

        <section className="vc-project-future">
          <div className="vc-container vc-future-inner">
            <Reveal>
              <p className="vc-eyebrow vc-eyebrow-light"><span /> La suite reste à construire</p>
              <h2 className="vc-display vc-section-title">Un aperçu ne vaut pas une mise en service.</h2>
              <p>
                Le README classe les devis, les transactions, les paiements, la réputation et la
                logistique parmi les fonctionnalités prévues. Elles ne sont pas présentées ici
                comme des services disponibles.
              </p>
              <PrimaryLink />
            </Reveal>
          </div>
        </section>
        <div className="vc-container vc-back-link">
          <Link className="vc-text-link" href="/">Retour à l’accueil <span aria-hidden="true">↗</span></Link>
        </div>
      </main>
    </PublicSite>
  )
}
