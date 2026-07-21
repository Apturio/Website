"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Menu, X, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@/blocks/_shared/Icon";
import { ComingSoonBadge } from "@/components/ComingSoonBadge";
import { isExternalHref, type NavigationView, type NavItemView } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type TFunction = ReturnType<typeof useTranslations>;

// Overrides navigation-menu.tsx's generic `hover:bg-accent hover:text-accent-foreground`
// (Tailwind `accent` = an unrelated green hue) with primary-based classes so the navbar
// doesn't introduce a second accent color (UI-SPEC Color contract).
const navTriggerClassName =
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary/10 hover:text-foreground focus:bg-primary/10 focus:text-foreground focus:outline-none data-[state=open]:bg-primary/10 data-[state=open]:text-foreground";

function DesktopMegaMenuRow({
  item,
  home,
  t,
}: {
  item: NavItemView;
  home: string;
  t: TFunction;
}) {
  if (item.status === "live" && item.href) {
    const external = isExternalHref(item.href);
    const resolvedHref = external ? item.href : `${home}${item.href}`;
    const rowContent = (
      <>
        {item.icon && (
          <Icon name={item.icon} className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-foreground">{item.label}</span>
          {item.description && (
            <span className="text-[13px] font-normal text-muted-foreground">
              {item.description}
            </span>
          )}
        </div>
      </>
    );
    return (
      <NavigationMenuLink asChild>
        {external ? (
          <a
            href={resolvedHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-primary/5"
          >
            {rowContent}
          </a>
        ) : (
          <Link
            href={resolvedHref}
            className="flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-primary/5"
          >
            {rowContent}
          </Link>
        )}
      </NavigationMenuLink>
    );
  }

  return (
    <div aria-disabled="true" className="flex items-start gap-3 rounded-md p-3 cursor-default">
      {item.icon && (
        <Icon name={item.icon} className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground opacity-50" />
      )}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">{item.label}</span>
          <ComingSoonBadge label={t("nav.comingSoon")} />
        </div>
        {item.description && (
          <span className="text-[13px] font-normal text-muted-foreground">
            {item.description}
          </span>
        )}
      </div>
    </div>
  );
}

function MobileMegaMenuRow({
  item,
  home,
  t,
  onNavigate,
}: {
  item: NavItemView;
  home: string;
  t: TFunction;
  onNavigate: () => void;
}) {
  if (item.status === "live" && item.href) {
    const external = isExternalHref(item.href);
    const resolvedHref = external ? item.href : `${home}${item.href}`;
    const rowContent = (
      <>
        {item.icon && <Icon name={item.icon} className="h-5 w-5 shrink-0 text-white" />}
        <span className="text-[16px] font-semibold text-white">{item.label}</span>
      </>
    );
    return external ? (
      <a
        href={resolvedHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className="flex min-h-[44px] items-center gap-4 rounded-xl p-4 transition-colors hover:bg-white/5"
      >
        {rowContent}
      </a>
    ) : (
      <Link
        href={resolvedHref}
        onClick={onNavigate}
        className="flex min-h-[44px] items-center gap-4 rounded-xl p-4 transition-colors hover:bg-white/5"
      >
        {rowContent}
      </Link>
    );
  }

  return (
    <div aria-disabled="true" className="flex min-h-[44px] items-center gap-4 rounded-xl p-4 cursor-default">
      {item.icon && (
        <Icon name={item.icon} className="h-5 w-5 shrink-0 text-slate-500 opacity-50" />
      )}
      <span className="text-[16px] font-semibold text-slate-500">{item.label}</span>
      <ComingSoonBadge label={t("nav.comingSoon")} />
    </div>
  );
}

export function NavbarClient({ view }: { view: NavigationView }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const language = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: 'en' | 'es') => {
    if (lang === language) return;
    // Prefer the localized counterpart URL emitted as an hreflang <link> by the
    // page's generateMetadata — handles localized slugs (e.g. /en/automated-booking
    // -> /es/agendamiento-automatizado). Fall back to swapping the locale prefix.
    let target: string | null = null;
    if (typeof document !== 'undefined') {
      const alt = document.querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang="${lang}"]`,
      );
      if (alt?.href) {
        try {
          const u = new URL(alt.href);
          target = u.pathname + u.search + u.hash;
        } catch {
          /* ignore malformed */
        }
      }
    }
    if (!target) {
      target = pathname.replace(new RegExp(`^/${language}`), `/${lang}`);
    }
    router.push(target);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const home = `/${language}`;

  // Same CTA route-resolution logic as Hero.tsx's secondary CTA — not reinvented
  // for the navbar (CONTEXT.md decision).
  const ctaHref =
    language === 'es' ? 'https://wa.me/15614731298' : `/${language}/strategy-call`;
  const ctaExternal = /^https?:\/\//.test(ctaHref);

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={home} className="flex items-center gap-2">
          <img src="https://vibe.filesafe.space/1775831502235366632/attachments/965b91f8-1e00-4fc8-acf4-8021d0d6fdcd.png" alt="Apturio Logo" className="h-10 w-auto" />
        </Link>

        <NavigationMenu className="hidden lg:flex" delayDuration={150}>
          <NavigationMenuList>
            {view.megaMenus.map((menu) => (
              <NavigationMenuItem key={menu.triggerLabel}>
                <NavigationMenuTrigger className={navTriggerClassName}>
                  {menu.triggerLabel}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div
                    className={cn(
                      "grid gap-8 p-6",
                      menu.columns.length > 1 ? "w-[560px] grid-cols-2" : "w-[320px] grid-cols-1",
                    )}
                  >
                    {menu.columns.map((column, colIdx) => (
                      <div key={column.label ?? colIdx} className="flex flex-col gap-1">
                        {column.label && (
                          <span className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {column.label}
                          </span>
                        )}
                        {column.items.map((item) => (
                          <DesktopMegaMenuRow key={item.label} item={item} home={home} t={t} />
                        ))}
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            {view.directLinks.map((link) =>
              link.status === "live" && link.href ? (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink asChild>
                    {isExternalHref(link.href) ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={navTriggerClassName}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={`${home}${link.href}`} className={navTriggerClassName}>
                        {link.label}
                      </Link>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={link.label}>
                  <div
                    aria-disabled="true"
                    className={cn(
                      navTriggerClassName,
                      "cursor-default gap-2 text-muted-foreground hover:bg-transparent hover:text-muted-foreground",
                    )}
                  >
                    <span>{link.label}</span>
                    <ComingSoonBadge label={t("nav.comingSoon")} />
                  </div>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                English {language === 'en' && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('es')}>
                Español {language === 'es' && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild className="rounded-[12px] font-bold">
            {ctaExternal ? (
              <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                {t('nav.getStarted')}
              </a>
            ) : (
              <Link href={ctaHref}>{t('nav.getStarted')}</Link>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6 text-foreground" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[99999] bg-black w-screen h-screen flex flex-col pt-[80px] px-[24px] pb-8 animate-in slide-in-from-right duration-300 overflow-y-auto lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="absolute top-4 right-4 hover:bg-white/10">
            <X className="h-8 w-8 text-white" />
          </Button>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-4 mb-4">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">{t('nav.language')}</span>
              <div className="flex gap-2">
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLanguageChange('en')}
                  className="rounded-full"
                >
                  EN
                </Button>
                <Button
                  variant={language === 'es' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLanguageChange('es')}
                  className="rounded-full"
                >
                  ES
                </Button>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {view.megaMenus.map((menu) => (
                <AccordionItem key={menu.triggerLabel} value={menu.triggerLabel} className="border-white/10">
                  <AccordionTrigger className="min-h-[44px] px-4 py-4 text-[18px] font-semibold text-white hover:no-underline [&>svg]:text-white">
                    {menu.triggerLabel}
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <div className="flex flex-col gap-1 px-4">
                      {menu.columns
                        .flatMap((column) => column.items)
                        .map((item) => (
                          <MobileMegaMenuRow
                            key={item.label}
                            item={item}
                            home={home}
                            t={t}
                            onNavigate={() => setIsOpen(false)}
                          />
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="flex flex-col gap-1 mt-2">
              {view.directLinks.map((link) =>
                link.status === "live" && link.href ? (
                  isExternalHref(link.href) ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-[44px] items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <span className="text-[18px] font-bold text-white">{link.label}</span>
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={`${home}${link.href}`}
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-[44px] items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <span className="text-[18px] font-bold text-white">{link.label}</span>
                    </Link>
                  )
                ) : (
                  <div
                    key={link.label}
                    aria-disabled="true"
                    className="flex min-h-[44px] items-center gap-4 p-4 rounded-xl cursor-default"
                  >
                    <span className="text-[18px] font-bold text-slate-500">{link.label}</span>
                    <ComingSoonBadge label={t("nav.comingSoon")} />
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="h-[1px] bg-white/10 my-8" />

          {ctaExternal ? (
            <a href={ctaHref} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="w-full">
              <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-[18px] shadow-[0_0_15px_rgba(120,125,255,0.4)] hover:shadow-[0_0_25px_rgba(120,125,255,0.6)] transition-all">
                {t('nav.getStarted')}
              </Button>
            </a>
          ) : (
            <Link href={ctaHref} onClick={() => setIsOpen(false)} className="w-full">
              <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-[18px] shadow-[0_0_15px_rgba(120,125,255,0.4)] hover:shadow-[0_0_25px_rgba(120,125,255,0.6)] transition-all">
                {t('nav.getStarted')}
              </Button>
            </Link>
          )}

          <div className="mt-auto text-center">
            <span className="text-[12px] uppercase text-slate-500 font-medium tracking-widest">{t('footer.copyright')} • {new Date().getFullYear()}</span>
          </div>
        </div>
      )}
    </header>
  );
}
