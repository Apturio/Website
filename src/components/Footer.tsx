import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

import { AdvantageCTA } from "@/components/AdvantageCTA";

// `showAdvantage` defaults to true (every non-home page renders the advantage
// card inside the footer). The home page sets it to false because the card is
// rendered there as the final CtaBlock — preserving the original layout exactly
// (advantage band on a card-coloured background, then the footer links).
export async function Footer({ showAdvantage = true }: { showAdvantage?: boolean } = {}) {
  const t = await getTranslations();
  const language = await getLocale();

  return (
    <footer className={`bg-card pb-8 ${showAdvantage ? "border-t border-border pt-16" : "pt-0"}`}>
      <div className="container mx-auto px-4">
        {showAdvantage && (
          <AdvantageCTA
            badge={t('footer.bonus')}
            title={t('footer.advantageTitle')}
            body={t('footer.advantageBody')}
            goal={t('footer.advantageGoal')}
            safety={t('footer.advantageSafety')}
            cancelAnytime={t('footer.cancelAnytime')}
          />
        )}

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
