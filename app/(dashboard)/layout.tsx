import DashboardShell from '@/components/DashboardShell'
import ScrollToTop from '@/components/ScrollToTop'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardShell>{children}</DashboardShell>
      <ScrollToTop />
    </>
  )
}
