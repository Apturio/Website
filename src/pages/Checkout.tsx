import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Check, ArrowLeft, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/use-seo";

export default function Checkout() {
  const { planId } = useParams();
  const { language, t } = useLanguage();
  useSEO(t('seo.checkout.title'), t('seo.checkout.description'));

  const plans = {
    foundation: {
      name: t('pricing.plans.foundation.name'),
      price: "$199",
      description: t('pricing.plans.foundation.description'),
      features: t('pricing.plans.foundation.features'),
      setupFee: "$0",
      checkoutUrl: language === 'es'
        ? "https://links.apturio.com/payment-link/69e8b657557558e89e521e88"
        : "https://links.apturio.com/payment-link/69e2176b7dd3512d92076d84",
    },
    engine: {
      name: t('pricing.plans.engine.name'),
      price: "$299",
      description: t('pricing.plans.engine.description'),
      features: t('pricing.plans.engine.features'),
      setupFee: t('checkout.waived'),
      checkoutUrl: language === 'es'
        ? "https://links.apturio.com/payment-link/69e8b6e0557558e89e521e95"
        : "https://links.apturio.com/payment-link/69ae32b51e61216a847af5d0",
    },
    growth: {
      name: t('pricing.plans.growth.name'),
      price: "$699",
      description: t('pricing.plans.growth.description'),
      features: t('pricing.plans.growth.features'),
      setupFee: t('checkout.waived'),
      checkoutUrl: language === 'es'
        ? "https://links.apturio.com/payment-link/69e8b750557558e89e521eb2"
        : "https://links.apturio.com/payment-link/69e4c8a97dd3512d9207747b",
    }
  };

  const plan = plans[planId as keyof typeof plans] || plans.engine;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link to="/#pricing" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('checkout.back')}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{t('checkout.title')}</h1>
                <p className="text-slate-400">{t('checkout.subtitle').replace('{planName}', plan.name)}</p>
              </div>

              <div className="space-y-6">
                {plan.checkoutUrl ? (
                  <iframe
                    src={plan.checkoutUrl}
                    className="w-full min-h-[800px] border-0 rounded-[20px] bg-white/5"
                    title={`Checkout for ${plan.name}`}
                  />
                ) : (
                  <div className="bg-card/50 border border-border rounded-[20px] p-12 text-center space-y-4">
                    <h2 className="text-xl font-bold text-white">{t('checkout.comingSoon')}</h2>
                    <p className="text-slate-400">{t('checkout.provideLink')}</p>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mt-4">
                  <ShieldCheck className="h-4 w-4 text-[#37ca37]" />
                  {t('checkout.secure')}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-[20px] p-8 sticky top-32">
                <h3 className="text-xl font-bold text-white mb-6">{t('checkout.summary')}</h3>

                <div className="flex justify-between items-start mb-6 pb-6 border-b border-border">
                  <div>
                    <div className="font-bold text-white text-lg">{plan.name}</div>
                    <div className="text-sm text-slate-400 mt-1">{t('checkout.billedMonthly')}</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{plan.price}</div>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{t('checkout.subtotal')}</span>
                    <span className="text-white">{plan.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{t('checkout.implementationFee')}</span>
                    <span className="text-[#37ca37] font-bold">{plan.setupFee}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-white font-bold">{t('checkout.totalDue')}</span>
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{t('checkout.included')}</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-400">
                        <Check className="h-5 w-5 shrink-0 text-[#37ca37]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
