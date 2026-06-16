"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslations, useLocale } from "next-intl";

type FaqItem = { q: string; a: string };

// Client component (Radix accordion holds open/close state). Accepts optional
// items + lang from a FaqBlock; falls back to next-intl when rendered bare.
export function FAQ({
  heading,
  items,
  lang,
}: {
  heading?: string;
  items?: FaqItem[];
  lang?: string;
} = {}) {
  const t = useTranslations();
  const locale = useLocale();
  const language = lang ?? locale;
  const title = heading ?? t('faq.title');
  const faqItems: FaqItem[] = items ?? (t.raw('faq.items') as FaqItem[]);

  return (
    <section id="faq" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">{title}</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-lg font-bold text-white hover:text-primary text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 text-base">
                {item.a.includes('[/pay-per-use]') ? (
                  <>
                    {item.a.split('[/pay-per-use]')[0]}
                    <a href={`/${language}/pay-per-use`} className="text-primary hover:underline">
                      {language === 'es' ? 'desglose detallado de precios' : 'detailed pricing breakdown'}
                    </a>
                    {item.a.split('[/pay-per-use]')[1]}
                  </>
                ) : item.a.includes('[/add-ons]') ? (
                  <>
                    {item.a.split('[/add-ons]')[0]}
                    <a href={`/${language}/add-ons`} className="text-primary hover:underline">
                      {language === 'es' ? 'desglose detallado de precios' : 'detailed pricing breakdown'}
                    </a>
                    {item.a.split('[/add-ons]')[1]}
                  </>
                ) : (
                  item.a
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
