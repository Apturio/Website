import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageCircle } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import type { HeroBlock } from "@/payload-types";

// Accepts an optional HeroBlock (block-driven home) and falls back to next-intl
// when rendered without a block (legacy hardcoded path). Markup is unchanged.
export async function Hero({ block, lang }: { block?: HeroBlock; lang?: string } = {}) {
  const t = await getTranslations();
  const language = lang ?? (await getLocale());

  const badge = block?.badge ?? t('hero.badge');
  const title = block?.title ?? t('hero.title');
  const description = block?.description ?? t('hero.description');
  const ctaPrimaryLabel = block?.ctaPrimaryLabel ?? t('hero.ctaPrimary');
  const ctaPrimaryHref = block?.ctaPrimaryHref ?? '#pricing';
  const ctaSecondaryLabel = block?.ctaSecondaryLabel ?? t('hero.ctaSecondary');
  const ctaSecondaryHref =
    block?.ctaSecondaryHref ??
    (language === 'es' ? 'https://wa.me/15614731298' : `/${language}/strategy-call`);
  const secondaryExternal = /^https?:\/\//.test(ctaSecondaryHref);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://vibe.filesafe.space/1775831502235366632/attachments/a728337c-2406-49d0-8723-db4b1ee16241.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Darker Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-background z-0" />

      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-40 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[100px] opacity-40 pointer-events-none z-0" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-white">{badge}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-white animate-color-shift [text-shadow:_0_4px_30px_rgba(0,0,0,1)]">
            {title}
          </h1>

          <p className="text-xl text-white mb-10 max-w-2xl mx-auto leading-relaxed font-medium [text-shadow:_0_2px_15px_rgba(0,0,0,1)]">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full max-w-md mx-auto sm:max-w-none">
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all rounded-[20px]">
              <a href={ctaPrimaryHref}>
                {ctaPrimaryLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>

            {secondaryExternal ? (
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white transition-all rounded-[20px]">
                <a href={ctaSecondaryHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {ctaSecondaryLabel}
                </a>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white transition-all rounded-[20px]">
                <Link href={ctaSecondaryHref}>
                  <Calendar className="mr-2 h-5 w-5" />
                  {ctaSecondaryLabel}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
