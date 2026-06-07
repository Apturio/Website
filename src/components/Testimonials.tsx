import { Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Testimonials() {
  const { t } = useLanguage();
  const reviews = t('testimonials.items') as any[];

  return (
    <section className="py-24 bg-card/30 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">{t('testimonials.title')}</h2>
          <p className="text-lg text-slate-400 md:whitespace-nowrap">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 max-w-7xl mx-auto">
          {reviews.map((review, index) => (
            <div key={index} className="p-8 rounded-[20px] bg-card border border-border shadow-sm mb-8 break-inside-avoid">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-lg mb-6 italic text-slate-400">"{review.text}"</p>
              <div className="font-bold text-lg text-white">{review.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
