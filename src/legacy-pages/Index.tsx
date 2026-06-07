import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustedBy } from "@/components/TrustedBy";
import { TheProblem } from "@/components/TheProblem";
import { Benefits } from "@/components/Benefits";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/use-seo";

const Index = () => {
  const { t } = useLanguage();
  useSEO(t('seo.home.title'), t('seo.home.description'));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TheProblem />
        <Benefits />
        <TrustedBy />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
