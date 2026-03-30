import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/features/home/Hero";
import ServicesGrid from "@/features/home/ServicesGrid";
import AboutValue from "@/features/home/AboutValue";
import ArticlesSection from "@/features/home/ArticlesSection";
import Testimonials from "@/features/home/Testimonials";
import Cta from "@/features/home/Cta";

export default function Home() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-white text-black">
      <Navbar />

      <main>
        <Hero />
        <ServicesGrid />
        <AboutValue />
        <ArticlesSection />
        <Testimonials />
        <Cta />
      </main>

      <Footer />
    </div>
  );
}

