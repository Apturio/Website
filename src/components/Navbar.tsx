import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, AlertCircle, Star, Tag, HelpCircle, Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: 'en' | 'es') => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // Only redirect if we are on the production domains
      const isProduction = hostname === 'apturio.com' || hostname === 'es.apturio.com';

      if (isProduction) {
        if (lang === 'es' && !hostname.startsWith('es.')) {
          window.location.href = `https://es.apturio.com${window.location.pathname}${window.location.hash}`;
          return;
        } else if (lang === 'en' && hostname.startsWith('es.')) {
          window.location.href = `https://apturio.com${window.location.pathname}${window.location.hash}`;
          return;
        }
      }
    }
    setLanguage(lang);
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

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="https://vibe.filesafe.space/1775831502235366632/attachments/965b91f8-1e00-4fc8-acf4-8021d0d6fdcd.png" alt="Apturio Logo" className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/#problem" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.problems')}</a>
          <a href="/#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.benefits')}</a>
          <a href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.pricing')}</a>
          <a href="/#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.faq')}</a>
        </nav>

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
          <Button asChild className="rounded-[12px] font-bold"><a href="/#pricing">{t('nav.getStarted')}</a></Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6 text-foreground" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[99999] bg-black w-screen h-screen flex flex-col pt-[80px] px-[24px] pb-8 animate-in slide-in-from-right duration-300">
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

            <a href="/#problem" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
              <AlertCircle className="w-6 h-6 text-white" />
              <span className="text-[22px] font-bold text-white">{t('nav.problems')}</span>
            </a>

            <a href="/#benefits" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <Star className="w-6 h-6 text-white" />
              <span className="text-[22px] font-bold text-white">{t('nav.benefits')}</span>
            </a>

            <a href="/#pricing" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <Tag className="w-6 h-6 text-white" />
              <span className="text-[22px] font-bold text-white">{t('nav.pricing')}</span>
            </a>

            <a href="/#faq" onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <HelpCircle className="w-6 h-6 text-white" />
              <span className="text-[22px] font-bold text-white">{t('nav.faq')}</span>
            </a>
          </div>

          <div className="h-[1px] bg-white/10 my-8" />

          <a href="/#pricing" onClick={() => setIsOpen(false)} className="w-full">
            <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-[18px] shadow-[0_0_15px_rgba(120,125,255,0.4)] hover:shadow-[0_0_25px_rgba(120,125,255,0.6)] transition-all">
              {t('nav.getStarted')}
            </Button>
          </a>

          <div className="mt-auto text-center">
            <span className="text-[12px] uppercase text-slate-500 font-medium tracking-widest">{t('footer.copyright')} • {new Date().getFullYear()}</span>
          </div>
        </div>
      )}
    </header>
  );
}
