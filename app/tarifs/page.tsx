import type { Metadata } from 'next'
import Image from 'next/image'
import PrimaryLink from '@/components/public-site/PrimaryLink'
import PublicSite from '@/components/public-site/PublicSite'
import Reveal from '@/components/public-site/Reveal'

export const metadata: Metadata = {
  title: 'Tarifs | ValueChain Connect',
  description:
    'Les tarifs de ValueChain Connect ne sont pas encore définis. Le projet est en conception et les modalités du pilote restent à discuter.',
}

export default function PricingPage() {
  return (
    <PublicSite>
      <main id="contenu" className="vc-info-page vc-pricing-page">
        <section className="vc-page-intro vc-container">
          <Reveal>
            <p className="vc-eyebrow"><span /> Tarifs · transparence</p>
            <h1 className="vc-display vc-page-title">Aucun tarif public à ce stade.</h1>
            <p className="vc-page-lede">
              ValueChain Connect est en conception. Le dépôt ne définit pas de tarif commercial
              validé ni de formule actuellement proposée.
            </p>
          </Reveal>
        </section>

        <section className="vc-pricing-panel vc-container" aria-labelledby="vc-pricing-title">
          <Reveal className="vc-pricing-card">
            <div className="vc-pricing-symbol" aria-hidden="true">
              <Image src="/brand/mark.svg" alt="" width={64} height={64} />
            </div>
            <div>
              <p className="vc-eyebrow"><span /> Information à jour</p>
              <h2 id="vc-pricing-title" className="vc-display vc-section-title">Les conditions du pilote restent à définir.</h2>
              <p>
                Le document de cadrage évoque une commission comme piste pour une phase future,
                sans taux validé ni condition d’application publiée. Aucun abonnement, frais de
                transaction ou paiement n’est annoncé comme disponible.
              </p>
              <div className="vc-pricing-facts">
                <div><span>Modèle commercial</span><strong>À définir</strong></div>
                <div><span>Prix public</span><strong>Non publié</strong></div>
                <div><span>État du produit</span><strong>En conception</strong></div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="vc-pricing-contact vc-container">
          <Reveal>
            <h2 className="vc-display vc-section-title">Vous souhaitez participer au pilote ?</h2>
            <p>Écrivez-nous. Les modalités seront discutées avant toute expérimentation commerciale.</p>
            <PrimaryLink />
          </Reveal>
        </section>
      </main>
    </PublicSite>
  )
}
