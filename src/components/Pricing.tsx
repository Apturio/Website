import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { PricingTable } from "./PricingTable";
import { PricingTableToggle } from "./PricingTableToggle";
import type { PricingBlock } from "@/payload-types";

type Tier = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  link: string;
  badge?: string;
  badgeStyle?: string;
  ctaColor: string;
  subText?: string;
};

// Per-tier visual tokens, keyed by planId — preserves the exact original styling
// regardless of whether plans come from a PricingBlock or next-intl.
const CTA_COLOR: Record<string, string> = {
  foundation: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  engine:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(120,125,255,0.4)] hover:shadow-[0_0_25px_rgba(120,125,255,0.6)]",
  growth: "bg-[#1f2937] text-white hover:bg-[#111827] shadow-none",
};
const ENGINE_BADGE_STYLE =
  "bg-[#111] border-[#37ca37] text-[#37ca37] shadow-[0_0_20px_rgba(55,202,55,0.8)]";

export async function Pricing({ block, lang }: { block?: PricingBlock; lang?: string } = {}) {
  const t = await getTranslations();
  const language = lang ?? (await getLocale());

  const heading = block?.heading ?? t('pricing.title');
  const subtitle = block?.subtitle ?? t('pricing.subtitle');
  const perMonth = t('pricing.perMonth');

  let tiers: Tier[];
  if (block?.plans && block.plans.length > 0) {
    tiers = block.plans.map((p) => ({
      id: p.planId,
      name: p.name,
      price: p.price,
      description: p.description ?? '',
      features: (p.features ?? []).map((f) => f.feature),
      cta: p.ctaLabel,
      link: p.ctaHref ?? `/${language}/checkout/${p.planId}`,
      badge: p.planId === 'engine' ? (p.bonus ?? t('pricing.bonus')) : undefined,
      badgeStyle: p.planId === 'engine' ? ENGINE_BADGE_STYLE : undefined,
      ctaColor: CTA_COLOR[p.planId] ?? CTA_COLOR.foundation,
      subText: p.subText ?? undefined,
    }));
  } else {
    tiers = [
      {
        id: 'foundation',
        name: t('pricing.plans.foundation.name'),
        price: "$199",
        description: t('pricing.plans.foundation.description'),
        features: t.raw('pricing.plans.foundation.features') as string[],
        cta: t('pricing.plans.foundation.cta'),
        link: `/${language}/checkout/foundation`,
        ctaColor: CTA_COLOR.foundation,
        subText: t('pricing.plans.foundation.subText'),
      },
      {
        id: 'engine',
        name: t('pricing.plans.engine.name'),
        price: "$299",
        description: t('pricing.plans.engine.description'),
        features: t.raw('pricing.plans.engine.features') as string[],
        cta: t('pricing.plans.engine.cta'),
        link: `/${language}/checkout/engine`,
        badge: t('pricing.bonus'),
        badgeStyle: ENGINE_BADGE_STYLE,
        ctaColor: CTA_COLOR.engine,
      },
      {
        id: 'growth',
        name: t('pricing.plans.growth.name'),
        price: "$699",
        description: t('pricing.plans.growth.description'),
        features: t.raw('pricing.plans.growth.features') as string[],
        cta: t('pricing.plans.growth.cta'),
        link: `/${language}/checkout/growth`,
        ctaColor: CTA_COLOR.growth,
      },
    ];
  }

  return (
    <section id="pricing" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">{heading}</h2>
          <p className="text-lg text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch mt-8 md:mt-0">
          {tiers.map((tier, index) => {
            const badge = tier.badge;
            const badgeStyle = tier.badgeStyle;
            return (
            <div
              key={index}
              className={`relative flex flex-col p-8 rounded-[20px] border ${
                tier.id === 'engine'
                  ? "border-primary shadow-[0_0_40px_rgba(120,125,255,0.2)] bg-card md:scale-110 z-10 py-10 my-4 md:my-0"
                  : "border-border bg-card/50 mt-8 md:mt-0"
              }`}
            >
              {badge && (
                <div className={`absolute -top-5 md:-top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 md:py-1 border text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full whitespace-nowrap z-20 w-max max-w-[90%] text-center ${badgeStyle || 'bg-background border-accent text-accent shadow-[0_0_20px_rgba(55,202,55,0.8)]'}`}>
                  {badge}
                </div>
              )}

              <div className="mb-8 mt-4 md:mt-2">
                <h3 className="text-2xl font-bold mb-2 font-heading text-white">{tier.name}</h3>
                <p className="text-slate-400 text-sm">{tier.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">{tier.price}</span>
                <span className="text-slate-400 font-medium">{perMonth}</span>
              </div>

              <ul className="space-y-4 mb-10 flex-1 flex flex-col">
                {tier.features.map((feature: string, fIndex: number) => {
                  const isHighlight = (feature.includes("FREE") || feature.includes("GRATIS") || feature.includes("$2,000") || feature.includes("$2.000")) && tier.id !== 'growth';
                  const isGrowthFirst = tier.id === 'growth' && fIndex === 0;

                  return (
                    <li key={fIndex} className="flex items-start gap-3">
                      <Check className={`h-6 w-6 shrink-0 ${isHighlight ? 'text-[#37ca37]' : tier.id === 'growth' ? 'text-slate-400' : 'text-primary'}`} />
                      <span className={`${isHighlight ? 'text-white font-bold' : isGrowthFirst ? 'text-white font-bold' : 'text-slate-400 font-medium'}`}>
                        {feature.split(/(\$2,000|\$2\.000)/).map((part, i) =>
                          (part === "$2,000" || part === "$2.000") ? <strong key={i} className="font-extrabold">{part}</strong> : part
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {tier.subText && (
                <p className="text-xs text-slate-500 mb-6 mt-auto text-center">{tier.subText}</p>
              )}

              <Button
                asChild
                className={`w-full h-14 text-sm md:text-base font-bold rounded-[20px] transition-all ${tier.ctaColor} mt-auto`}
              >
                <Link href={tier.link}>{tier.cta}</Link>
              </Button>
            </div>
            );
          })}
        </div>

        <PricingTableToggle label={t('pricing.table.cta')}>
          <PricingTable />
        </PricingTableToggle>

        <div className="mt-20 text-center max-w-4xl mx-auto p-10 rounded-[20px] border border-border bg-[#0a0a0a] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

          <h3 className="text-primary text-sm font-bold tracking-widest uppercase mb-2">
            {t('pricing.implementation.title')}
          </h3>
          <h4 className="text-2xl font-bold text-white mb-6">
            {t('pricing.implementation.subtitle')}
          </h4>

          <div className="text-slate-400 mb-10 space-y-4 max-w-2xl mx-auto text-lg leading-relaxed">
            <p>
              {t('pricing.implementation.body1')}
            </p>
            <p>
              {t('pricing.implementation.body2')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-sm">
              <span className="text-lg">🔥</span> {t('pricing.implementation.pills.0')}
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-sm">
              <span className="text-lg">⚙️</span> {t('pricing.implementation.pills.1')}
            </div>
            <div className="flex items-center gap-2 bg-[#37ca37]/10 border border-[#37ca37]/30 rounded-full px-5 py-2.5 text-sm font-medium text-[#37ca37] shadow-[0_0_15px_rgba(55,202,55,0.1)]">
              <span className="text-lg">🛠️</span> {t('pricing.implementation.pills.2')}
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-6 max-w-2xl mx-auto border-t border-border/50 pt-6">
            {t('pricing.implementation.note')}
          </p>

          <div className="mt-12 pt-12 border-t border-border/50">
            <h5 className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4">
              {t('pricing.enterprise.title')}
            </h5>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              {t('pricing.enterprise.body')}
            </p>
            {language === 'es' ? (
              <Button asChild variant="outline" className="rounded-full border-white/20 hover:bg-white/10 text-white font-bold px-8">
                <a href="https://wa.me/15614731298" target="_blank" rel="noopener noreferrer">
                  {t('pricing.enterprise.cta')}
                </a>
              </Button>
            ) : (
              <Button asChild variant="outline" className="rounded-full border-white/20 hover:bg-white/10 text-white font-bold px-8">
                <Link href={`/${language}/strategy-call`}>
                  {t('pricing.enterprise.cta')}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
