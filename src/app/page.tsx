import type { Metadata } from 'next'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import HeroSection from '@/components/public/HeroSection'
import CategoriesSection from '@/components/public/CategoriesSection'
import FeaturedPostsSection from '@/components/public/FeaturedPostsSection'
import BackToTop from '@/components/public/BackToTop'

export const metadata: Metadata = {
  title: 'Life-Style — Code & Language by Peter',
  description:
    'Personal brand and blog by Peter — tutorials on Java, JavaScript, Python, AI, and English for developers.',
  openGraph: {
    title: 'Life-Style — Code & Language by Peter',
    description: 'Tutorials on Code & English to level up your skills and career.',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070D1A] text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedPostsSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
