import type { Metadata } from 'next'
import Image from 'next/image'
import photos from '@/lib/credits-photos.json'
import PublicSite from '@/components/public-site/PublicSite'
import Reveal from '@/components/public-site/Reveal'

export const metadata: Metadata = {
  title: 'Crédits photos | ValueChain Connect',
  description: 'Sources, auteurs et licences des photographies utilisées sur ValueChain Connect.',
}

const descriptions: Record<string, string> = {
  'industrie-coton': 'Balles de coton près d’un camion de transport.',
  'industrie-cereales': 'Des personnes travaillent ensemble autour de céréales.',
}

export default function CreditsPage() {
  return (
    <PublicSite>
      <main id="contenu" className="vc-info-page vc-credits-page">
        <section className="vc-page-intro vc-container">
          <Reveal>
            <p className="vc-eyebrow"><span /> Transparence · images</p>
            <h1 className="vc-display vc-page-title">Chaque image a sa source.</h1>
            <p className="vc-page-lede">
              Les photographies ci-dessous proviennent du dossier public de Forge Afrika. Les
              fichiers WebP sont repris sans retouche supplémentaire sur ce site.
            </p>
          </Reveal>
        </section>

        <section className="vc-container vc-credit-list" aria-label="Attributions des photographies">
          {photos.map((photo, index) => (
            <Reveal className="vc-credit-item" key={photo.slug} delay={index * 0.08}>
              <div className="vc-credit-image">
                <Image
                  src={photo.fichier}
                  alt={descriptions[photo.slug] ?? ''}
                  width={photo.width}
                  height={photo.height}
                  quality={75}
                  sizes="(min-width: 1024px) 36vw, 100vw"
                />
              </div>
              <div className="vc-credit-copy">
                <span className="vc-step-state">{photo.licence}</span>
                <h2 className="vc-display">{photo.titre}</h2>
                <dl>
                  <div><dt>Auteur</dt><dd>{photo.auteur}</dd></div>
                  <div><dt>Licence</dt><dd><a href={photo.licenceUrl} target="_blank" rel="noreferrer">{photo.licence}</a></dd></div>
                  <div><dt>Source</dt><dd><a href={photo.source} target="_blank" rel="noreferrer">Voir la page d’origine</a></dd></div>
                </dl>
                <p>{photo.modifications}</p>
              </div>
            </Reveal>
          ))}
        </section>
      </main>
    </PublicSite>
  )
}
