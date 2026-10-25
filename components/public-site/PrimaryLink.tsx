import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

export const PILOT_MAILTO = 'mailto:docompaore2@gmail.com?subject=ValueChain%20Connect%20%7C%20Liste%20pilote'

export default function PrimaryLink({
  children = 'Rejoindre la liste pilote',
  href = PILOT_MAILTO,
}: {
  children?: ReactNode
  href?: string
}) {
  return (
    <a className="vc-button" href={href}>
      <span>{children}</span>
      <span className="vc-button-icon" aria-hidden="true">
        <ArrowRight size={18} strokeWidth={1.8} />
      </span>
    </a>
  )
}
