import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/use-seo";

const ThankYou = () => {
  const { t } = useLanguage();
  const steps = t('thankyou.steps') as string[];
  useSEO(t('seo.thankyou.title'), t('seo.thankyou.description'));

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container max-w-2xl text-center space-y-8 animate-fade-in-up">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-[#37ca37]/10 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-[#37ca37]" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{t('thankyou.title')}</h1>
            <p className="text-xl text-slate-400">{t('thankyou.subtitle')}</p>
          </div>

          <div className="p-8 rounded-2xl bg-[#111111] border border-white/10 text-left space-y-4 max-w-md mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6366f1] to-[#37ca37]"></div>
            <h3 className="text-lg font-semibold text-white">{t('thankyou.nextSteps')}</h3>
            <ul className="space-y-4 text-slate-400">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-[#37ca37] font-bold">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8">
            <Link to="/">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
                {t('thankyou.button')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
