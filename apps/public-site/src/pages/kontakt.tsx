import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { submitContact } from "@/api/client";
import { useSeo } from "@/hooks/use-seo";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";
import { DemoNotice } from "@/components/demo-notice";

const schema = z.object({
  name: z.string().min(1, "Namn är obligatoriskt"),
  email: z.string().email("Ange en giltig e-postadress"),
  subject: z.string().min(1, "Ämne är obligatoriskt"),
  message: z.string().min(1, "Meddelande är obligatoriskt"),
  /** Honeypot - must be empty. */
  website: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

const subjectOptions = [
  "Allmän fråga",
  "Företagssamarbete",
  "Föreläsning / Workshop",
  "Press & Media",
  "Lediga tjänster",
  "Annat",
];

/**
 * Maps short URL keys (?amne=foretag) to full subject labels.
 * Supports both short keys and exact-match full labels for flexibility.
 */
const subjectAliases: Record<string, string> = {
  foretag: "Företagssamarbete",
  forelasning: "Föreläsning / Workshop",
  workshop: "Föreläsning / Workshop",
  press: "Press & Media",
  media: "Press & Media",
  jobb: "Lediga tjänster",
  lediga: "Lediga tjänster",
  allmant: "Allmän fråga",
  annat: "Annat",
};

function resolveSubject(raw: string | null): string {
  if (!raw) return "";
  // Try exact match first (?amne=Företagssamarbete)
  if (subjectOptions.includes(raw)) return raw;
  // Then try short key (?amne=foretag)
  const lower = raw.toLowerCase().trim();
  return subjectAliases[lower] ?? "";
}

function KontaktForm() {
  const [submitted, setSubmitted] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [serverError, setServerError] = useState("");
  const [searchParams] = useSearchParams();
  const prefillSubject = resolveSubject(searchParams.get("amne"));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      subject: prefillSubject,
      message: "",
    },
  });

  async function onSubmit(data: FormData) {
    // Honeypot check - bots fill this field
    if (data.website) {
      setSubmitted(true);
      return;
    }
    setServerError("");
    try {
      const result = await submitContact(data);
      if (result.success) {
        setDelivered(result.delivered);
        setSubmitted(true);
      } else setServerError("Något gick fel. Försök igen.");
    } catch {
      setServerError("Något gick fel. Försök igen.");
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-border/60 shadow-sm">
      {submitted ? (
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-brand-navy mx-auto mb-4" />
          <h3 className="text-2xl font-display font-extrabold text-text mb-2">
            Tack för ditt meddelande!
          </h3>
          <p className="text-text-muted leading-relaxed">
            Vi hör av oss inom en arbetsdag.
          </p>
          {!delivered && <DemoNotice />}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Honeypot - hidden from users, bots fill it out */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">
              Namn <span className="text-brand-red">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ditt namn"
              className={`rounded-input h-11 ${errors.name ? "border-error" : ""}`}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-error" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              E-post <span className="text-brand-red">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="din@email.se"
              className={`rounded-input h-11 ${errors.email ? "border-error" : ""}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">
              Ämne <span className="text-brand-red">*</span>
            </Label>
            <select
              id="subject"
              aria-describedby={errors.subject ? "subject-error" : undefined}
              aria-invalid={!!errors.subject}
              className={`flex h-11 w-full rounded-input border bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red ${errors.subject ? "border-error" : "border-input"}`}
              {...register("subject")}
            >
              <option value="">Vad gäller det?</option>
              {subjectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p id="subject-error" className="text-sm text-error" role="alert">
                {errors.subject.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">
              Meddelande <span className="text-brand-red">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Berätta vad vi kan hjälpa dig med..."
              rows={5}
              className={`rounded-input ${errors.message ? "border-error" : ""}`}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-sm text-error" role="alert">
                {errors.message.message}
              </p>
            )}
          </div>
          {serverError && (
            <p className="text-sm text-error text-center" role="alert">
              {serverError}
            </p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full h-12 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-red/20 hover:shadow-brand-red/30 transition-all duration-300"
          >
            {isSubmitting ? "Skickar..." : "Skicka meddelande"}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function KontaktPage() {
  const seo = useSeo({
    title: "Kontakt",
    description:
      "Har du frågor eller vill veta mer? Vi svarar snabbt och gärna. Ring, mejla eller fyll i formuläret.",
    canonical: "/kontakt",
  });

  return (
    <>
      {seo}
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_84%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_84%)]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              /* The optimised 42 KB copy, not the 497 KB "-scaled" original.
                 This sits at 30% opacity behind a 70% navy overlay, so the
                 extra detail was never visible - it just cost 455 KB and made
                 itself the LCP element (mobile Lighthouse 81, LCP 5.3s).
                 index.html already preloads this file for the home hero, so on
                 this page it now resolves from cache instead of downloading. */
              backgroundImage:
                "url('/images/deltagare_boostbyfcr_pa_trappa.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-brand-navy/70" />
        </div>
        <div className="pointer-events-none absolute -bottom-32 [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] -left-32 h-80 w-80 rounded-full bg-brand-navy/8 blur-3xl" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <ScrollReveal>
            <p className="text-xs font-body font-medium text-brand-red-bright tracking-widest uppercase mb-4">
              Kontakt
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
              Hör av dig
            </h1>
            <p className="text-lg text-white/75 max-w-lg leading-relaxed">
              Vi svarar snabbt och gärna. Oavsett om du är deltagare,
              arbetsgivare eller journalist.
            </p>
          </ScrollReveal>
        </div>
        <WaveDivider from="navy" to="white" />
      </section>

      {/* Contact content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <ScrollReveal direction="left">
              <div>
                <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text mb-4">
                  Vi finns här
                </h2>
                <p className="text-text-muted leading-relaxed mb-8">
                  Har du frågor om våra program, vill anmäla dig eller bara veta
                  mer om vad vi gör? Fyll i formuläret så hör vi av oss inom en
                  arbetsdag. Du kan också ringa eller mejla oss direkt.
                </p>
                <div className="space-y-5">
                  {[
                    {
                      icon: MapPin,
                      title: "Adress",
                      detail: "Norra Grängesbergsgatan 15, 214 50 Malmö",
                    },
                    {
                      icon: Phone,
                      title: "Telefon",
                      detail: "070-992 17 66",
                    },
                    {
                      icon: Mail,
                      title: "E-post",
                      detail: "info@boostbyfcr.se",
                    },
                  ].map((item, i) => (
                    <ScrollReveal key={item.title} delay={i * 0.1}>
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-brand-red/10 text-brand-red shrink-0">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-display font-semibold text-text">
                            {item.title}
                          </p>
                          <p className="text-sm text-text-muted">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
                <div className="mt-8 rounded-2xl overflow-hidden border border-border/60">
                  <iframe
                    title="Boost by FC Rosengård på karta"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2266.0!2d13.7585!3d55.5867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46539a9c1e1e1e1%3A0x0!2sNorra%20Gr%C3%A4ngesbergsgatan%2015%2C%20214%2050%20Malm%C3%B6!5e0!3m2!1ssv!2sse!4v1"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <KontaktForm />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
