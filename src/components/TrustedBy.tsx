import { getTranslations } from "next-intl/server";

const logos = [
  { name: "Sportsmed Academy", src: "https://vibe.filesafe.space/1775831502235366632/attachments/40dbb601-c692-4abc-b2a9-6b77e3b414ea.png", old: true },
  { name: "SM Privé", src: "https://vibe.filesafe.space/1775831502235366632/attachments/112147e9-ed3a-4f3c-92e9-47c6f1c6cf81.png", old: true },
  { name: "Venxel", src: "https://vibe.filesafe.space/1775831502235366632/attachments/b5f01474-d965-4589-a2b4-d84fc8860b36.png", old: true },
  { name: "En Otro Idioma", src: "https://vibe.filesafe.space/1775831502235366632/attachments/6139c761-d36d-4240-8a90-ccec4045bec9.png", old: true },
  { name: "Aprendo SEO", src: "https://vibe.filesafe.space/1775831502235366632/attachments/7d0ff8ad-4917-46be-b2a4-501c8f5b0c9b.png", old: true },
  { name: "Forja Group", src: "https://vibe.filesafe.space/1775831502235366632/attachments/07fed6fa-f329-4106-b0a6-eaa6156111eb.png", old: false },
  { name: "New Cargo Express", src: "https://vibe.filesafe.space/1775831502235366632/attachments/2f4d42da-e799-4211-ae7e-7d72ed9b95e4.png", old: false },
  { name: "Dharma Health", src: "https://vibe.filesafe.space/1775831502235366632/attachments/b59b13fc-6550-45b1-8e9a-4ae25904dcf7.png", old: false },
];

export const TrustedBy = async () => {
  const t = await getTranslations();

  return (
    <section className="bg-[#000000] py-[60px]">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-center text-3xl md:text-5xl font-bold mb-12 tracking-tight text-white">
          {t('trustedBy.title')}
        </h2>

        <div className="w-full max-w-6xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-8">
          <div className="flex gap-12 md:gap-20 items-center w-max animate-marquee hover:[animation-play-state:paused]">
            {[...logos, ...logos].map((logo, index) => (
              <div key={index} className="flex items-center justify-center shrink-0">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className={`max-h-[28px] md:max-h-[32px] w-auto object-contain opacity-55 transition-all duration-300 hover:opacity-100 ${
                    logo.old ? "grayscale contrast-200 brightness-200 mix-blend-screen" : "brightness-0 invert"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-primary/80 uppercase mb-6">
            {t('trustedBy.globalOperations')}
          </h3>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full max-w-5xl mx-auto">
            {[
              { name: t('trustedBy.countries.ca'), code: "ca" },
              { name: t('trustedBy.countries.ar'), code: "ar" },
              { name: t('trustedBy.countries.mx'), code: "mx" },
              { name: t('trustedBy.countries.es'), code: "es" },
              { name: t('trustedBy.countries.ve'), code: "ve" },
            ].map((country) => (
              <div
                key={country.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(120,125,255,0.2)] transition-all duration-300 cursor-default group"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 bg-muted border border-white/10">
                  <img
                    src={`https://flagcdn.com/w40/${country.code}.png`}
                    alt={`${country.name} flag`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-white text-sm font-sans font-medium">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
