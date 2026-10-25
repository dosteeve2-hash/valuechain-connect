import Image from 'next/image'
import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="vc-footer">
      <div className="vc-container">
        <div className="vc-footer-main">
          <div className="vc-footer-brand-block">
            <Link href="/" className="vc-footer-brand" aria-label="ValueChain Connect, accueil">
              <Image
                src="/brand/logo-sombre.svg"
                alt="ValueChain Connect"
                width={395}
                height={88}
                className="vc-footer-logo"
              />
            </Link>
            <p>Du producteur au transformateur, sans intermédiaire de trop.</p>
          </div>
          <div className="vc-footer-links">
            <div>
              <span className="vc-footer-label">Explorer</span>
              <Link href="/le-projet">Le projet</Link>
              <Link href="/#catalogue">Le prototype</Link>
              <Link href="/tarifs">Tarifs</Link>
            </div>
            <div>
              <span className="vc-footer-label">Contact</span>
              <a href="mailto:docompaore2@gmail.com">docompaore2@gmail.com</a>
              <Link href="/credits">Crédits photos</Link>
              <Link href="/auth/login">Connexion</Link>
            </div>
          </div>
        </div>
        <div className="vc-footer-bottom">
          <span>ValueChain Connect · Projet en conception</span>
          <span>© {new Date().getFullYear()} ValueChain Connect</span>
        </div>
      </div>
    </footer>
  )
}
