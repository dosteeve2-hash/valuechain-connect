'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const destinations = ['Débouché A', 'Débouché B']

export default function LotFlow() {
  return (
    <figure className="vc-flow" aria-labelledby="vc-flow-caption">
      <figcaption id="vc-flow-caption" className="sr-only">
        Exemple pédagogique : un lot de matière première se répartit vers deux caisses illustratives.
      </figcaption>
      <div className="vc-flow-origin">
        <span className="vc-flow-origin-mark">
          <Image src="/brand/mark.svg" alt="" width={64} height={64} />
        </span>
        <span className="vc-flow-origin-label">Un lot de matière première</span>
      </div>
      <div className="vc-flow-branch" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="vc-flow-destinations">
        {destinations.map((destination, index) => (
          <motion.div
            className="vc-crate"
            key={destination}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="vc-crate-illustration" aria-hidden="true">
              <span />
            </span>
            <span className="vc-crate-title">{destination}</span>
            <span className="vc-crate-caption">caisse illustrative</span>
          </motion.div>
        ))}
      </div>
      <p className="vc-flow-disclaimer">Exemple pédagogique, aucune offre ni transaction réelle.</p>
    </figure>
  )
}
