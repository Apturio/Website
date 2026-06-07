import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/use-seo";

const StrategyCall = () => {
  const { t } = useLanguage();
  useSEO(t('seo.strategy.title'), t('seo.strategy.description'));

  useEffect(() => {
    window.scrollTo(0, 0);
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">{t('strategy.title')}</h1>
            <p className="text-slate-400 text-lg">{t('strategy.subtitle')}</p>
          </div>
          <div className="bg-card border border-border rounded-[20px] overflow-hidden shadow-[0_0_30px_rgba(120,125,255,0.05)]">
            <iframe
              src="https://links.apturio.com/widget/bookings/apturio-consulting-session"
              style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "800px" }}
              scrolling="no"
              id="msgsndr-calendar"
              title="Apturio Strategy Call Booking"
            ></iframe>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StrategyCall;
