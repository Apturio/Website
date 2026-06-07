import { Rocket } from "lucide-react";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations();
  const language = await getLocale();

  return (
    <footer className="border-t border-border bg-card pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto mb-16 bg-background rounded-[20px] p-8 border border-primary/40 shadow-[0_0_30px_rgba(120,125,255,0.15)] text-center">
          <div className="absolute -top-4 right-4 md:-right-4 px-4 py-1.5 bg-background border border-[#37ca37] text-[#37ca37] text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(55,202,55,0.4)] whitespace-nowrap z-10">
            {t('footer.bonus')}
          </div>
          <Rocket className="h-12 w-12 text-primary mx-auto mb-4 drop-shadow-[0_0_10px_rgba(120,125,255,0.5)]" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#FFFFFF]">{t('footer.advantageTitle')}</h3>
          <p className="text-[#94a3b8] text-lg mb-4 max-w-2xl mx-auto">
            {t('footer.advantageBody')}
          </p>
          <p className="text-[#FFFFFF] text-lg mb-2 font-medium max-w-2xl mx-auto">
            {t('footer.advantageGoal')}
          </p>
          <p className="text-[#37ca37] text-base mb-6 font-semibold max-w-2xl mx-auto drop-shadow-[0_0_8px_rgba(55,202,55,0.4)]">
            {t('footer.advantageSafety')}
          </p>
          <p className="text-sm font-medium text-[#94a3b8] uppercase tracking-widest">
            {t('footer.cancelAnytime')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border/50 text-sm text-slate-400">
          <Link href={`/${language}`} className="flex items-center gap-2">
            <img src="https://vibe.filesafe.space/1775831502235366632/attachments/965b91f8-1e00-4fc8-acf4-8021d0d6fdcd.png" alt="Apturio Logo" className="h-10 w-auto" />
          </Link>

          <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
            <Link href={`/${language}/pay-per-use`} className="hover:text-primary transition-colors">{t('footer.payPerUse')}</Link>
            <Link href={`/${language}/add-ons`} className="hover:text-primary transition-colors">{language === 'es' ? 'Precios de Add-Ons' : 'Add-Ons Pricing'}</Link>
            <Link href={`/${language}/privacy-policy`} className="hover:text-primary transition-colors">{t('footer.privacy')}</Link>
            <Link href={`/${language}/terms-of-service`} className="hover:text-primary transition-colors">{t('footer.terms')}</Link>
          </div>

          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
