import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

import { AdvantageCTA } from "@/components/AdvantageCTA";
import { ComingSoonBadge } from "@/components/ComingSoonBadge";
import { footerColumns, type NavLink as NavLinkEntry } from "@/lib/nav-links";

type TFunction = Awaited<ReturnType<typeof getTranslations>>;

// Shared live/comingSoon row renderer for the 3 registry-driven columns —
// mirrors Navbar.tsx's DesktopMegaMenuRow / MobileMegaMenuRow treatment so
// live rows are locale-prefixed Links and comingSoon rows are aria-disabled
// with the shared ComingSoonBadge (LINKSTATE-02/03).
function FooterLinkRow({
  item,
  home,
  t,
  comingSoonLabel,
}: {
  item: NavLinkEntry;
  home: string;
  t: TFunction;
  comingSoonLabel: string;
}) {
  if (item.status === "live" && item.href) {
    return (
      <li>
        <Link href={`${home}${item.href}`} className="text-sm text-slate-400 hover:text-primary transition-colors">
          {t(item.labelKey)}
        </Link>
      </li>
    );
  }

  return (
    <li aria-disabled="true" className="flex items-center gap-2 cursor-default">
      <span className="text-sm text-slate-400">{t(item.labelKey)}</span>
      <ComingSoonBadge label={comingSoonLabel} />
    </li>
  );
}

// `showAdvantage` defaults to true (every non-home page renders the advantage
// card inside the footer). The home page sets it to false because the card is
// rendered there as the final CtaBlock — preserving the original layout exactly
// (advantage band on a card-coloured background, then the footer links).
export async function Footer({ showAdvantage = true }: { showAdvantage?: boolean } = {}) {
  const t = await getTranslations();
  const language = await getLocale();
  const home = `/${language}`;
  const comingSoonLabel = t("nav.comingSoon");

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

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 pt-8 border-t border-border/50">
          <div>
            <Link href={home} className="flex items-center gap-2">
              <img src="https://vibe.filesafe.space/1775831502235366632/attachments/965b91f8-1e00-4fc8-acf4-8021d0d6fdcd.png" alt="Apturio Logo" className="h-10 w-auto" />
            </Link>
            <p className="mt-4 text-sm text-slate-400">{t('footer.tagline')}</p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.headingKey}>
              <p className="text-sm font-semibold">{t(column.headingKey)}</p>
              <ul className="mt-4 space-y-2">
                {column.items.map((item) => (
                  <FooterLinkRow key={item.labelKey} item={item} home={home} t={t} comingSoonLabel={comingSoonLabel} />
                ))}
              </ul>

              {column.subgroup && (
                <>
                  <p className="mt-6 text-[10px] uppercase text-muted-foreground/70">{t(column.subgroup.headingKey)}</p>
                  <ul className="mt-4 space-y-2">
                    {column.subgroup.items.map((item) => (
                      <FooterLinkRow key={item.labelKey} item={item} home={home} t={t} comingSoonLabel={comingSoonLabel} />
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border/50 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
