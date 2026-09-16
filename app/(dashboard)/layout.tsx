import DashboardShell from '@/components/DashboardShell'

/**
 * Server Component. Toute la navigation — barre latérale, tiroir, en-tête — vit dans
 * `DashboardShell`, le seul morceau qui a besoin d'être client. Les pages passées en
 * `children` restent rendues côté serveur.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
