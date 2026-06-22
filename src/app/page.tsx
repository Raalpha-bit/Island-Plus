import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import FeaturedCreators from '@/components/landing/FeaturedCreators';
import CategoriesSection from '@/components/landing/CategoriesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedCreators />
        <CategoriesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
