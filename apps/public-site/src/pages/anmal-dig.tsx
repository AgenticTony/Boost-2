import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Shield,
  MessageCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";

/**
 * Native, on-brand Anmälan form that posts directly into Anna's existing
 * Bridge-enrollment Google Form - responses land in the same Google Sheet.
 * Entry IDs are sourced from the live form. NOTE: the meeting time slots are
 * hardcoded from the form; if Anna changes them in Google Forms, this list
 * must be refreshed to match.
 */
const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeXgSD42m6JLWIna8yE7C03qD4h_I-6TdPC-Mr3MWpS5mZ8lQ/formResponse";

const ENTRY = {
  name: "entry.1567091042",
  personnummer: "entry.2040378868",
  phone: "entry.1502921893",
  email: "entry.234922361",
  handlerName: "entry.248650715",
  handlerContact: "entry.128291249",
  meetingTime: "entry.788472964",
  other: "entry.1770564120",
  /** Consent is a Google Forms checkbox - the option label is literally "Alternativ 1". */
  consent: "entry.1676789778",
} as const;
const CONSENT_VALUE = "Alternativ 1";

/**
 * Meeting slots - fallback used if /api/slots is unavailable. Mirrors the
 * Google Form's current options; the live list is fetched on mount.
 */
const FALLBACK_SLOTS = [
  "23 juli kl 14:00",
  "23 juli kl 15:00",
  "28 juli kl 15:00",
  "30 juli kl 15:00",
  "4 augusti kl 15:00",
  "6 augusti kl 15:00",
  "12 augusti kl 14:00",
  "12 augusti kl 15:00",
  "18 augusti kl 10:00",
  "19 augusti kl 10:00",
  "21 augusti kl 9:00",
  "21 augusti kl 10:00",
  "21 augusti kl 13:00",
  "28 augusti kl 9:00",
  "31 augusti kl 9:00",
  "31 augusti kl 10:30",
  "4 september kl 9:00",
];

const steps = [
  "Vi läser din anmälan",
  "En vägledare kontaktar dig",
  "Vi bokar ett första möte",
];

const schema = z.object({
  name: z.string().min(1, "För- och efternamn är obligatoriskt"),
  personnummer: z.string().min(1, "Personnummer är obligatoriskt"),
  phone: z.string().optional(),
  email: z
    .string()
    .email("Ange en giltig e-postadress")
    .optional()
    .or(z.literal("")),
  handlerName: z.string().min(1, "Handläggarens namn är obligatoriskt"),
  handlerContact: z.string().optional(),
  meetingTime: z.string().min(1, "Välj en tid för inskrivningsmöte"),
  other: z.string().optional(),
  consent: z
    .boolean()
    .refine(
      (v) => v === true,
      "Du måste godkänna behandling av personuppgifter",
    ),
  /** Honeypot - must be empty. */
  website: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label} {required && <span className="text-brand-red">*</span>}
      </Label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (error?: string) =>
  `rounded-input h-11 ${error ? "border-error" : ""}`;
const selectCls = (error?: string) =>
  `flex h-11 w-full rounded-input border bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red ${
    error ? "border-error" : "border-input"
  }`;

export default function AnmalDigPage() {
  const seo = useSeo({
    title: "Anmäl dig",
    description:
      "Ta första steget - det tar tre minuter. Vi hör av oss inom en arbetsdag.",
    canonical: "/anmal-dig",
  });
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      personnummer: "",
      phone: "",
      email: "",
      handlerName: "",
      handlerContact: "",
      meetingTime: "",
      other: "",
      consent: false,
      website: "",
    },
  });

  const [meetingSlots, setMeetingSlots] = useState<string[]>(FALLBACK_SLOTS);

  // Live-sync the meeting-time options from /api/slots (Anna's Google Form).
  // Falls back to FALLBACK_SLOTS on any failure so the form always works.
  useEffect(() => {
    if (typeof fetch !== "function") return; // jsdom / test guard
    fetch("/api/slots")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.slots) && data.slots.length > 0) {
          setMeetingSlots(data.slots);
        } else if (import.meta.env.DEV) {
          console.info(
            "[anmal-dig] /api/slots unavailable (expected in `vite dev`). Showing fallback slots - use `vercel dev` to exercise live sync.",
          );
        }
      })
      .catch(() => {
        /* keep fallback */
      });
  }, []);

  async function onSubmit(data: FormData) {
    // Honeypot - bots fill this; pretend success.
    if (data.website) {
      setSubmitted(true);
      return;
    }
    setServerError("");
    try {
      const params = new URLSearchParams();
      params.set(ENTRY.name, data.name);
      params.set(ENTRY.personnummer, data.personnummer);
      if (data.phone) params.set(ENTRY.phone, data.phone);
      if (data.email) params.set(ENTRY.email, data.email);
      params.set(ENTRY.handlerName, data.handlerName);
      if (data.handlerContact)
        params.set(ENTRY.handlerContact, data.handlerContact);
      params.set(ENTRY.meetingTime, data.meetingTime);
      if (data.other) params.set(ENTRY.other, data.other);
      if (data.consent) params.set(ENTRY.consent, CONSENT_VALUE);
      // no-cors: Google accepts the POST; the response is opaque, so on resolve
      // we treat it as delivered.
      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        body: params,
      });
      setSubmitted(true);
    } catch {
      setServerError("Något gick fel vid sändningen. Försök igen.");
    }
  }

  return (
    <>
      {seo}
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-navy/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] -left-32 h-80 w-80 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <ScrollReveal>
            <p className="text-xs font-body font-medium text-brand-red-bright tracking-widest uppercase mb-4">
              Kom igång
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
              Ta första steget.
            </h1>
            <p className="text-lg text-white/75 max-w-lg leading-relaxed">
              Det tar ungefär tre minuter. Du behöver inte ha allt klart - bara
              vara redo att börja.
            </p>
          </ScrollReveal>
        </div>
        <WaveDivider from="navy" to="surface" />
      </section>

      {/* Trust bar */}
      <section className="py-8 bg-surface">
        <div className="container-page">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: Clock, label: "Tar 3 minuter" },
              { icon: Shield, label: "Dina uppgifter är trygga" },
              { icon: MessageCircle, label: "Vi hör av oss inom en arbetsdag" },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 0.1}>
                <div className="flex flex-col items-center gap-2">
                  <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-brand-navy text-white">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-text">
                    {item.label}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page max-w-2xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text mb-4">
              Fyll i dina uppgifter
            </h2>
            <p className="text-text-muted mb-8 leading-relaxed">
              Mötet som du anmäler dig till är ett individuellt möte på Boost By
              FC Rosengård, Norra Grängesbergsgatan 15, med den vägledare som du
              kommer att samarbeta med. För att kunna delta i ESF-projektet
              Bridge by FCR behöver du vara mellan 18-29 år och kunna ta dig
              till Malmö. Bokar du en tid som du sen inte kan komma till behöver
              du meddela det till info@boostbyfcr.se eller ring 070-992 17 66.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            {submitted ? (
              <div className="bg-white rounded-2xl p-8 md:p-12 border border-border/60 text-center">
                <CheckCircle className="h-16 w-16 text-brand-navy mx-auto mb-4" />
                <h3 className="text-2xl font-display font-extrabold text-text mb-2">
                  Tack - din anmälan är mottagen
                </h3>
                <p className="text-text-muted leading-relaxed">
                  En vägledare kontaktar dig inom en arbetsdag. Behöver du ändra
                  eller avanmäla en tid? Mejla info@boostbyfcr.se eller ring
                  070-992 17 66.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-border/60 shadow-sm">
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

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field
                      label="För- och efternamn"
                      htmlFor="name"
                      required
                      error={errors.name?.message}
                    >
                      <Input
                        id="name"
                        placeholder="För- och efternamn"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        className={inputCls(errors.name?.message)}
                        {...register("name")}
                      />
                    </Field>
                    <Field
                      label="Personnummer (ÅÅMMDD-XXXX)"
                      htmlFor="personnummer"
                      required
                      error={errors.personnummer?.message}
                    >
                      <Input
                        id="personnummer"
                        placeholder="ÅÅMMDD-XXXX"
                        autoComplete="off"
                        aria-invalid={!!errors.personnummer}
                        className={inputCls(errors.personnummer?.message)}
                        {...register("personnummer")}
                      />
                    </Field>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field
                      label="Telefonnummer"
                      htmlFor="phone"
                      error={errors.phone?.message}
                    >
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="07x-xxx xx xx"
                        autoComplete="tel"
                        className={inputCls(errors.phone?.message)}
                        {...register("phone")}
                      />
                    </Field>
                    <Field
                      label="Mejladress"
                      htmlFor="email"
                      error={errors.email?.message}
                    >
                      <Input
                        id="email"
                        type="email"
                        placeholder="din@email.se"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        className={inputCls(errors.email?.message)}
                        {...register("email")}
                      />
                    </Field>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field
                      label="Handläggare, namn"
                      htmlFor="handlerName"
                      required
                      error={errors.handlerName?.message}
                    >
                      <Input
                        id="handlerName"
                        placeholder="Handläggarens namn"
                        className={inputCls(errors.handlerName?.message)}
                        {...register("handlerName")}
                      />
                    </Field>
                    <Field
                      label="Handläggare, mejl och telefonnummer"
                      htmlFor="handlerContact"
                      error={errors.handlerContact?.message}
                    >
                      <Input
                        id="handlerContact"
                        placeholder="mejl och telefon"
                        className={inputCls(errors.handlerContact?.message)}
                        {...register("handlerContact")}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Tid för inskrivningsmöte"
                    htmlFor="meetingTime"
                    required
                    error={errors.meetingTime?.message}
                  >
                    <select
                      id="meetingTime"
                      aria-invalid={!!errors.meetingTime}
                      className={selectCls(errors.meetingTime?.message)}
                      {...register("meetingTime")}
                    >
                      <option value="" disabled>
                        Välj en tid
                      </option>
                      {meetingSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="Övrig information"
                    htmlFor="other"
                    error={errors.other?.message}
                  >
                    <Textarea
                      id="other"
                      placeholder="Valfritt - något vi bör veta?"
                      rows={4}
                      className="rounded-input"
                      {...register("other")}
                    />
                  </Field>

                  <div className="flex items-start gap-3 rounded-input border border-border/60 bg-surface p-4">
                    <input
                      id="consent"
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#C93320]"
                      aria-invalid={!!errors.consent}
                      {...register("consent")}
                    />
                    <Label
                      htmlFor="consent"
                      className="text-sm font-normal leading-relaxed text-text"
                    >
                      Jag godkänner behandling av mina personuppgifter.{" "}
                      <span className="text-brand-red">*</span>
                    </Label>
                  </div>
                  {errors.consent && (
                    <p className="text-sm text-error" role="alert">
                      {errors.consent.message}
                    </p>
                  )}
                  <p className="text-xs text-text-muted leading-relaxed">
                    <span className="text-brand-red">*</span> Vi behöver spara
                    och behandla dessa personuppgifter om dig så att vi vet
                    vilka som kommer till oss, och så att vi kan kontakta dig
                    för att ge information om inskrivningsmötet. Vi behöver
                    också dem till att berätta för dina myndighetskontakter om
                    din närvaro på mötet. Du har rätt att återkalla ditt
                    samtycke när du vill - kontakta oss på info@boostbyfcr.se.
                    Läs mer i vår{" "}
                    <Link
                      to="/dataskyddspolicy"
                      className="font-semibold text-brand-navy underline hover:text-brand-red"
                    >
                      dataskyddspolicy
                    </Link>
                    .
                  </p>

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
                    {isSubmitting ? "Skickar..." : "Skicka anmälan"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Steps - glass on navy */}
      <section className="bg-brand-navy text-white overflow-hidden">
        <WaveDivider from="white" to="navy" mirror />
        <div className="container-page py-16 md:py-24">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-center mb-12">
              Vad händer sen?
            </h2>
          </ScrollReveal>
          <div className="relative max-w-3xl mx-auto">
            <div className="hidden md:block absolute top-6 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5 bg-brand-red/40" />
            <div className="grid md:grid-cols-3 gap-8 md:gap-6">
              {steps.map((step, i) => (
                <ScrollReveal key={step} delay={i * 0.15}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-brand-red text-white font-display font-extrabold text-lg mb-4 relative z-10 shadow-lg shadow-brand-red/25">
                      {i + 1}
                    </div>
                    <p className="text-white/90 font-medium">{step}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
        <WaveDivider from="navy" to="navy" />
      </section>
    </>
  );
}
