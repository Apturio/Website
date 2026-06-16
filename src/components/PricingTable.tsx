import { Check, Minus } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import React from "react";

export async function PricingTable() {
  const t = await getTranslations();
  const language = await getLocale();

  const categories = [
    {
      id: 'strategy',
      name: t('pricing.table.categories.strategy'),
      features: [
        { name: t('pricing.table.features.strategy.lead'), foundation: "Lead management", engine: "Revenue generation", growth: "Business scaling" },
        { name: t('pricing.table.features.strategy.goals'), foundation: "Capture & manage leads", engine: "Convert leads into revenue", growth: "Scale acquisition + automation" },
        { name: t('pricing.table.features.strategy.positioning'), foundation: "“Perfect for small teams”", engine: "“Built for growing teams”", growth: "“Designed for scaling organizations”" },
        { name: t('pricing.table.features.strategy.teamSize'), foundation: "Solo / small teams", engine: "Growing teams", growth: "Structured teams" },
        { name: t('pricing.table.features.strategy.structure'), foundation: "Owner / Admin / 1 staff", engine: "Sales team (3) / Admin / Marketing", growth: "Sales team (5) / Admin (2) / Marketing (3)" },
        { name: t('pricing.table.features.strategy.seats'), foundation: "3", engine: "5", growth: "10" },
        { name: t('pricing.table.features.strategy.extraSeat'), foundation: "$20", engine: "$25", growth: "$35" },
      ]
    },
    {
      id: 'crm',
      name: t('pricing.table.categories.crm'),
      features: [
        { name: t('pricing.table.features.crm.contacts'), foundation: "✔️ up to 1000", engine: "✔️ Up to 5000", growth: "✔️ unlimited contacts" },
        { name: t('pricing.table.features.crm.fields'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.crm.lists'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.crm.feed'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.crm.multi'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.crm.whatsapp'), foundation: "_", engine: true, growth: true },
        { name: t('pricing.table.features.crm.missed'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.crm.phone'), foundation: "_", engine: "_", growth: "_" },
        { name: t('pricing.table.features.crm.chat'), foundation: true, engine: true, growth: true },
      ]
    },
    {
      id: 'calendars',
      name: t('pricing.table.categories.calendars'),
      features: [
        { name: t('pricing.table.features.calendars.unlimited'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.calendars.types'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.calendars.menu'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.calendars.rental'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.calendars.advanced'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.calendars.booking'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.calendars.payments'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.calendars.synching'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.calendars.video'), foundation: true, engine: true, growth: true },
      ]
    },
    {
      id: 'pipelines',
      name: t('pricing.table.categories.pipelines'),
      features: [
        { name: t('pricing.table.features.pipelines.unlimited'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.pipelines.custom'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.pipelines.nurturing'), foundation: true, engine: true, growth: true },
      ]
    },
    {
      id: 'automation',
      name: t('pricing.table.categories.automation'),
      features: [
        { name: t('pricing.table.features.automation.triggers'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.automation.visual'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.automation.webhooks'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.automation.thirdParty'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.automation.premium'), foundation: "_", engine: "_", growth: "_" },
      ]
    },
    {
      id: 'marketing',
      name: t('pricing.table.categories.marketing'),
      features: [
        { name: t('pricing.table.features.marketing.emails'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.marketing.creator'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.marketing.html'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.marketing.templates'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.marketing.advanced'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.marketing.subscribe'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.marketing.triggerLinks'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.marketing.social'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.marketing.prospecting'), foundation: false, engine: "_", growth: true },
        { name: t('pricing.table.features.marketing.adManager'), foundation: "_", engine: "_", growth: true },
      ]
    },
    {
      id: 'sites',
      name: t('pricing.table.categories.sites'),
      features: [
        { name: t('pricing.table.features.sites.builder'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.sites.funnels'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.sites.blogs'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.sites.editing'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.sites.forms'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.sites.chat'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.sites.wordpress'), foundation: false, engine: "_", growth: true },
        { name: t('pricing.table.features.sites.stores'), foundation: false, engine: false, growth: true },
      ]
    },
    {
      id: 'affiliate',
      name: t('pricing.table.categories.affiliate'),
      features: [
        { name: t('pricing.table.features.affiliate.campaigns'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.affiliate.integrations'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.affiliate.portal'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.affiliate.commissions'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.affiliate.payout'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.affiliate.stats'), foundation: false, engine: false, growth: true },
      ]
    },
    {
      id: 'payments',
      name: t('pricing.table.categories.payments'),
      features: [
        { name: t('pricing.table.features.payments.integrations'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.payments.invoicing'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.payments.estimates'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.payments.links'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.payments.products'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.payments.coupons'), foundation: false, engine: true, growth: true },
      ]
    },
    {
      id: 'documents',
      name: t('pricing.table.categories.documents'),
      features: [
        { name: t('pricing.table.features.documents.generate'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.documents.sign'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.documents.send'), foundation: false, engine: false, growth: true },
      ]
    },
    {
      id: 'ai',
      name: t('pricing.table.categories.ai'),
      features: [
        { name: t('pricing.table.features.ai.conv'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.ai.voice'), foundation: false, engine: "_", growth: true },
        { name: t('pricing.table.features.ai.studio'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.ai.content'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.ai.knowledge'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.ai.integration'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.ai.channels'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.ai.employee'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.ai.credits'), foundation: false, engine: "$30", growth: "$70" },
      ]
    },
    {
      id: 'reputation',
      name: t('pricing.table.categories.reputation'),
      features: [
        { name: t('pricing.table.features.reputation.requests'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.reputation.dashboard'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.reputation.management'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.reputation.widgets'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.reputation.video'), foundation: false, engine: false, growth: true },
      ]
    },
    {
      id: 'analytics',
      name: t('pricing.table.categories.analytics'),
      features: [
        { name: t('pricing.table.features.analytics.dashboard'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.analytics.adData'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.analytics.reports'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.analytics.call'), foundation: true, engine: true, growth: true },
      ]
    },
    {
      id: 'advanced',
      name: t('pricing.table.categories.advanced'),
      features: [
        { name: t('pricing.table.features.advanced.api'), foundation: false, engine: false, growth: true },
        { name: t('pricing.table.features.advanced.domains'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.advanced.redirect'), foundation: false, engine: true, growth: true },
        { name: t('pricing.table.features.advanced.tracking'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.advanced.apps'), foundation: true, engine: true, growth: true },
      ]
    },
    {
      id: 'support',
      name: t('pricing.table.categories.support'),
      features: [
        { name: t('pricing.table.features.support.self'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.support.guided'), foundation: false, engine: "20h (WAIVED)", growth: "20h (WAIVED)" },
        { name: t('pricing.table.features.support.strategy'), foundation: false, engine: false, growth: "10h (WAIVED)" },
        { name: t('pricing.table.features.support.human'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.support.site'), foundation: true, engine: true, growth: true },
        { name: t('pricing.table.features.support.bot'), foundation: true, engine: true, growth: true },
      ]
    }
  ];

  const plans = [
    { id: 'foundation', name: t('pricing.plans.foundation.name') },
    { id: 'engine', name: t('pricing.plans.engine.name') },
    { id: 'growth', name: t('pricing.plans.growth.name') },
  ];

  const formatPrice = (value: string) => {
    if (!value || typeof value !== 'string') return value;
    if (!value.startsWith('$')) return value;
    return language === 'es' ? value.replace(/\./g, ',') : value;
  };

  const renderValue = (value: boolean | string, isEngine: boolean) => {
    if (value === true) return <Check className={`h-5 w-5 mx-auto ${isEngine ? 'text-primary' : 'text-slate-500'}`} />;
    if (value === false || value === "ADDON" || value === "_") return <Minus className="h-5 w-5 mx-auto text-slate-700" />;
    if (typeof value === 'string' && value.includes("(WAIVED)")) {
      const text = value.replace("(WAIVED)", "").trim();
      return (
        <div className="flex flex-col items-center gap-1">
          {text && <span className={`text-sm font-medium ${isEngine ? 'text-white' : 'text-slate-400'}`}>{text}</span>}
          <span className="text-[9px] font-bold text-[#37ca37] border border-[#37ca37]/30 bg-[#37ca37]/10 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
            {t('pricing.table.waived')}
          </span>
        </div>
      );
    }
    if (typeof value === 'string' && value.startsWith("✔️")) {
      const text = value.replace("✔️", "").trim();

      if (text === "/ _" || text === "/_") {
        return (
          <div className="flex flex-col items-center justify-center gap-1">
            <Check className={`h-5 w-5 ${isEngine ? 'text-primary' : 'text-slate-500'}`} />
            <div className="flex items-center gap-1 text-slate-700">
               <span>/</span>
               <Minus className="h-4 w-4" />
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center gap-0.5">
          <Check className={`h-4 w-4 ${isEngine ? 'text-primary' : 'text-slate-500'}`} />
          <span className={`text-[11px] font-medium leading-tight ${isEngine ? 'text-white' : 'text-slate-400'}`}>
            {text}
          </span>
        </div>
      );
    }
    return <span className={`text-sm font-medium ${isEngine ? 'text-white' : 'text-slate-400'}`}>{formatPrice(value)}</span>;
  };

  return (
    <div className="mt-16 border border-border rounded-[20px] bg-card/30 backdrop-blur-sm overflow-hidden">
      <div className="md:hidden px-4 py-2 bg-muted/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center justify-center gap-2 border-b border-border">
        <span className="animate-pulse">←</span> {t('pricing.table.scrollHint') || "Desliza para comparar"} <span className="animate-pulse">→</span>
      </div>
      <div className="overflow-auto custom-scrollbar max-h-[75vh] md:max-h-[85vh]">
        <table className="w-full border-separate border-spacing-0 min-w-[500px] md:min-w-0">
          <thead className="z-30">
            <tr className="">
              <th className="sticky left-0 top-0 z-40 py-6 px-3 md:px-6 text-left text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs bg-black shadow-[2px_0_10px_rgba(0,0,0,0.5),0_1px_0_0_hsl(var(--border))] w-[110px] min-w-[110px] max-w-[110px] md:w-1/3 md:min-w-[200px] md:max-w-none whitespace-normal break-words leading-tight">
                {t('pricing.table.columnFeature')}
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  className={`sticky top-0 z-30 py-6 px-2 md:px-4 text-center bg-black shadow-[0_1px_0_0_hsl(var(--border))] min-w-[100px] md:min-w-0 ${
                    plan.id === 'engine' ? 'text-primary font-bold' : 'text-white font-bold uppercase tracking-wider text-[11px] md:text-xs'
                  }`}
                >
                  {plan.id === 'engine' && (
                    <div className="absolute inset-0 bg-primary/10 -z-10" />
                  )}
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <tr className="bg-white/[0.05]">
                  <td colSpan={4} className="py-4 px-6 text-sm font-bold text-white uppercase tracking-widest bg-gradient-to-r from-white/[0.12] to-transparent border-b border-border/50">
                    {category.name}
                  </td>
                </tr>
                {category.features.map((feature, index) => (
                  <tr key={index} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="sticky left-0 z-10 py-4 px-3 md:px-6 text-[11px] md:text-sm text-slate-300 font-medium bg-black border-b border-border/30 group-last:border-none shadow-[2px_0_10px_rgba(0,0,0,0.5),1px_0_0_0_hsl(var(--border))] w-[110px] min-w-[110px] max-w-[110px] md:w-1/3 md:min-w-[200px] md:max-w-none whitespace-normal break-words leading-snug md:leading-normal">
                      {feature.name}
                    </td>
                    <td className="py-5 px-4 text-center border-b border-border/30 group-last:border-none">
                      {renderValue(feature.foundation, false)}
                    </td>
                    <td className="py-5 px-4 text-center bg-primary/[0.02] border-b border-border/30 group-last:border-none relative">
                      {renderValue(feature.engine, true)}
                    </td>
                    <td className="py-5 px-4 text-center border-b border-border/30 group-last:border-none">
                      {renderValue(feature.growth, false)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
