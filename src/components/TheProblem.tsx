import { TrendingDown, Clock, Layers, Bot, Settings, Activity, AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function TheProblem() {
  const t = await getTranslations();
  const problems = t.raw('problem.items') as { title: string; description: string }[];

  const icons = [
    <TrendingDown className="h-8 w-8 text-primary" />,
    <Clock className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(120,125,255,0.5)]" />,
    <Layers className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(120,125,255,0.5)]" />,
    <Bot className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(120,125,255,0.5)]" />,
    <Settings className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(120,125,255,0.5)]" />,
    <Activity className="h-8 w-8 text-primary drop-shadow-[0_0_10px_rgba(120,125,255,0.5)]" />
  ];

  return (
    <section id="problem" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight text-white">{t('problem.title')}</h2>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#37ca37]/10 border border-[#37ca37]">
            <AlertTriangle className="w-5 h-5 text-[#37ca37]" />
            <span className="text-lg font-semibold text-[#37ca37] [text-shadow:_0_0_8px_rgba(55,202,55,0.5)]">
              {t('problem.subtitle')}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="group p-8 rounded-[20px] bg-card border border-border hover:border-primary/50 transition-all shadow-sm">
              <div className="h-16 w-16 rounded-[16px] bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_15px_rgba(120,125,255,0.3)]">
                {icons[index]}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{problem.title}</h3>
              <p className="text-slate-400 leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
