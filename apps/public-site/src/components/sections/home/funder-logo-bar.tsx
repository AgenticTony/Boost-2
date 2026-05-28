/** Funder logo data - sized by optical weight */
const funders = [
  {
    alt: "EU Socialfonden",
    src: "/images/eu-logo-jordbruksfonden.webp",
    width: 140,
    height: 96,
    className: "h-20 md:h-24 max-w-[140px]",
  },
  {
    alt: "Allmänna Arvsfonden",
    src: "/images/af-logo.webp",
    width: 210,
    height: 112,
    className: "h-24 md:h-28 max-w-[210px]",
  },
  {
    alt: "Malmö Stad",
    src: "/images/malmostad-logo2013-inv.png",
    width: 180,
    height: 96,
    className: "h-20 md:h-24 max-w-[180px]",
  },
  {
    alt: "FC Rosengård",
    src: "/images/FCR_logo_2014_CMYK.webp",
    width: 140,
    height: 96,
    className: "h-20 md:h-24 max-w-[140px]",
  },
];

/** Funder logo bar - bottom of homepage */
export function FunderLogoBar() {
  return (
    <section className="bg-brand-navy/80 border-b-4 border-b-brand-red">
      <div className="container-page py-14 md:py-20">
        <p className="text-center text-sm md:text-base font-display font-semibold uppercase tracking-widest text-white/80 mb-10">
          Finansieras och stöds av
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {funders.map((funder) => (
            <img
              key={funder.alt}
              src={funder.src}
              alt={funder.alt}
              width={funder.width}
              height={funder.height}
              className={`w-auto object-contain hover:scale-105 transition-transform duration-300 ${funder.className}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
