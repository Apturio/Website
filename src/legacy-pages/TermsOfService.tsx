import { useLanguage } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { useSEO } from "@/hooks/use-seo";

const TermsOfService = () => {
  const { t } = useLanguage();
  const content = t("terms.content");

  useSEO(t('seo.terms.title'), t('seo.terms.description'));

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-32 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 font-heading text-white">{t("terms.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("terms.lastUpdated")}</p>

        <div className="space-y-8">
          {Array.isArray(content) && content.map((item: any, index: number) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold mb-4 text-primary">{item.title}</h2>
              <p className="text-slate-300 leading-relaxed">{item.text}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
