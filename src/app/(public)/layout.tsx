import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import BackToTop from '@/components/public/BackToTop'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#070D1A] text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  )
}
