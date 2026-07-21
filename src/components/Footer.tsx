import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
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

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/15614731298"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footer.social.whatsapp')}
              className="p-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/apturio_official/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footer.social.instagram')}
              className="p-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/apturio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footer.social.linkedin')}
              className="p-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
