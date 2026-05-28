import { useRef, useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

/** BEAT 6: Om Boost + Inclusion.
 *  Mirrors SelfmadeSection's layout (container-page + contained media card +
 *  text column) so the video + text stay grouped at every viewport - the only
 *  difference is the media is a <video> instead of an <img>. Previously this
 *  section was full-bleed, which split the video and text apart on wide screens. */
export function AboutBoostSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  // Lazy-load: only fetch the video sources when the section scrolls into view.
  // Defers ~815 KiB (webm + mp4) off the initial page load - this section is well
  // below the fold and was needlessly downloading on first paint.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-page py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video card - contained like the Selfmade image */}
          <ScrollReveal>
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl bg-brand-red/10 -rotate-1"
                aria-hidden="true"
              />
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload={inView ? "auto" : "none"}
                aria-label="Korta klipp: händer som lägger sig runt en ung planta och formar ett hjärta - en bild av omvårdnad och tillväxt."
                className="relative w-full h-auto rounded-3xl shadow-lg aspect-video object-cover"
                poster="/images/illustration-hands-heart.webp"
              >
                {inView && (
                  <>
                    <source src="/images/hand-heart.webm" type="video/webm" />
                    <source src="/images/hand-heart.mp4" type="video/mp4" />
                  </>
                )}
              </video>
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="right">
            <div className="lg:pl-12 xl:pl-24">
              <p className="text-sm font-body font-medium text-brand-navy tracking-widest uppercase mb-4">
                Om Boost by FC Rosengård
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-text leading-tight mb-6">
                Vi skapar relationer som öppnar dörrar vidare
              </h2>
              <p className="text-text-muted leading-relaxed text-lg mb-8">
                Boost by FC Rosengård är en ideell förening som stöttar unga att
                hitta vägar vidare mot arbete, studier och en hållbar framtid.
                Vi kombinerar vägledning, aktiviteter och ett starkt nätverk för
                att skapa konkreta möjligheter. Vårt arbetssätt bygger på en
                helhetssyn där varje individ får stöd utifrån sina egna mål och
                förutsättningar.
              </p>

              <div className="h-px bg-border mb-8" />

              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-5 w-5 text-brand-red" />
                <p className="text-sm font-body font-medium text-brand-red tracking-widest uppercase">
                  Inkludering
                </p>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold text-text leading-tight mb-4">
                Ingen ska behöva stå utanför
              </h3>
              <p className="text-text-muted leading-relaxed text-lg">
                Vi sätter individen i centrum och tror på varje människas inre
                kapacitet och vilja. Hos oss ska det vara enkelt att kliva in -
                oavsett bakgrund, erfarenheter eller var man befinner sig i
                livet.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
