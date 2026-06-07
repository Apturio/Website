import { CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Benefits() {
  const t = await getTranslations();
  const benefits = t.raw('benefits.items') as { title: string; description: string }[];
  return (
    <section id="benefits" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="bg-card border border-primary/20 rounded-[20px] p-8 md:p-16 relative overflow-hidden shadow-[0_0_30px_rgba(120,125,255,0.05)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              {t('benefits.title')}
            </h2>
            <p className="text-lg text-slate-400 mb-12">
              {t('benefits.subtitle')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {benefits.map((item, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-accent/10 p-1">
                      <CheckCircle2 className="h-6 w-6 text-accent shrink-0 drop-shadow-[0_0_8px_rgba(55,202,55,0.8)]" />
                    </div>
                    <h3 className="font-bold text-xl text-white">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 pl-10">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
