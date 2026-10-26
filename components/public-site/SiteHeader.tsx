import Image from 'next/image'
import Link from 'next/link'

const links = [
  { href: '/le-projet', label: 'Le projet' },
  { href: '/#catalogue', label: 'Le prototype' },
  { href: '/tarifs', label: 'Tarifs' },
]

export default function SiteHeader() {
  return (
    <header className="vc-header">
      <div className="vc-container vc-header-inner">
        <Link href="/" className="vc-brand" aria-label="ValueChain Connect, accueil">
          <Image
            src="/brand/logo.svg"
            alt="ValueChain Connect"
            width={347}
            height={64}
            className="vc-brand-logo"
          />
        </Link>

        <nav className="vc-desktop-nav" aria-label="Navigation principale">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href="/auth/login" className="vc-login-link">
            Connexion
          </Link>
        </nav>

        <details className="vc-mobile-menu">
          <summary aria-label="Ouvrir le menu">Menu</summary>
          <nav aria-label="Navigation mobile">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/auth/login">Connexion</Link>
          </nav>
        </details>
      </div>
    </header>
  )
}
