'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const PRODUCTS = ['Coton', 'Sésame', 'Karité', 'Maïs'] as const
const REGIONS = ['Toutes les régions', 'Centre', 'Hauts-Bassins'] as const
const CERTIFICATIONS = ['Sans filtre', 'Biologique', 'Fair Trade'] as const

type Product = (typeof PRODUCTS)[number]
type Region = (typeof REGIONS)[number]
type Certification = (typeof CERTIFICATIONS)[number]

export default function CataloguePreview() {
  const [product, setProduct] = useState<Product>('Sésame')
  const [region, setRegion] = useState<Region>('Toutes les régions')
  const [certification, setCertification] = useState<Certification>('Sans filtre')

  return (
    <div className="vc-catalogue-demo">
      <div className="vc-filter-panel">
        <div className="vc-filter-panel-head">
          <span className="vc-demo-dot" aria-hidden="true" />
          <span>Filtres de recherche</span>
          <span className="vc-demo-label">illustration</span>
        </div>
        <label className="vc-field">
          <span>Produit</span>
          <select value={product} onChange={(event) => setProduct(event.currentTarget.value as Product)}>
            {PRODUCTS.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="vc-field">
          <span>Région</span>
          <select value={region} onChange={(event) => setRegion(event.currentTarget.value as Region)}>
            {REGIONS.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="vc-field">
          <span>Certification</span>
          <select
            value={certification}
            onChange={(event) => setCertification(event.currentTarget.value as Certification)}
          >
            {CERTIFICATIONS.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
      </div>

      <div className="vc-results-panel">
        <div className="vc-results-head">
          <span>Aperçu d’un résultat</span>
          <span className="vc-results-count">exemple</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.article
            className="vc-lot-card"
            key={`${product}-${region}-${certification}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            aria-live="polite"
          >
            <div className="vc-lot-card-top">
              <span className="vc-lot-mark" aria-hidden="true" />
              <span className="vc-lot-card-type">Lot illustratif</span>
            </div>
            <h3>{product}</h3>
            <dl className="vc-lot-details">
              <div><dt>Région</dt><dd>{region}</dd></div>
              <div><dt>Certification</dt><dd>{certification}</dd></div>
            </dl>
            <p>Aucune offre réelle n’est affichée.</p>
          </motion.article>
        </AnimatePresence>
        <p className="vc-demo-note">
          Maquette interactive. Le prototype actuel filtre par produit ou vendeur, catégorie,
          disponibilité et prix. Les filtres région et certification ci-dessus illustrent une
          piste de recherche, sans représenter des offres disponibles.
        </p>
      </div>
    </div>
  )
}
