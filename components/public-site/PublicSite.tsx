import type { ReactNode } from 'react'
import MotionPreferences from '@/components/public-site/MotionPreferences'
import SiteFooter from '@/components/public-site/SiteFooter'
import SiteHeader from '@/components/public-site/SiteHeader'

export default function PublicSite({ children }: { children: ReactNode }) {
  return (
    <div className="vc-site">
      <a className="vc-skip-link" href="#contenu">
        Aller au contenu
      </a>
      <SiteHeader />
      <MotionPreferences>{children}</MotionPreferences>
      <SiteFooter />
    </div>
  )
}
