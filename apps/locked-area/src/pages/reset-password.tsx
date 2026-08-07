import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ArrowLeft, AlertTriangle } from "lucide-react";
import { useAuth } from "@/auth/use-auth";
import { passwordSchema } from "@/lib/password-policy";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Seo } from "@/components/seo";

const REDIRECT_DELAY_MS = 3000;

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Bekräfta ditt lösenord"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword, hasSession, isLoading } = useAuth();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = useWatch({ control, name: "password" });

  // Redirect after the confirmation has been on screen long enough to read.
  // Driven by an effect rather than a timer started in the submit handler, so
  // the cleanup is tied to the component's lifetime and the timer cannot fire
  // against a screen the member has already navigated away from.
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(
      () => navigate("/login", { replace: true }),
      REDIRECT_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [done, navigate]);

  const onSubmit = async (values: Values) => {
    const result = await updatePassword(values.password);

    if (result.success) {
      setDone(true);
    } else {
      setError("root", { message: result.error || "Ett fel uppstod." });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Spinner size="lg" label="Kontrollerar länken" />
      </div>
    );
  }

  // Opening /reset-password without a recovery session means the link expired,
  // was already used, or the page was reached directly. Previously the form
  // rendered anyway and only failed on submit, with Supabase's raw English
  // error as the only explanation.
  if (!hasSession) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
        <Card className="w-full max-w-md p-8 text-center shadow-md">
          <div className="w-12 h-12 rounded-input bg-brand-red-light flex items-center justify-center mx-auto mb-4">
            <AlertTriangle
              className="w-6 h-6 text-brand-red"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-xl font-display font-bold text-text mb-2">
            Länken är ogiltig eller har gått ut
          </h2>
          <p className="text-text-muted text-sm mb-6">
            Återställningslänkar går att använda en gång och är giltiga en
            begränsad tid. Begär en ny så skickar vi ett nytt mejl.
          </p>
          <Button asChild>
            <Link to="/forgot-password">Begär en ny länk</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
        <Card className="w-full max-w-md p-8 text-center shadow-md">
          <div className="w-12 h-12 rounded-input bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-success" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-display font-bold text-text mb-2">
            Lösenord uppdaterat!
          </h2>
          <p className="text-text-muted text-sm mb-4">
            Ditt lösenord har ändrats. Du omdirigeras till inloggningen...
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-brand-red hover:text-brand-red/80 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Gå till inloggning
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
      <Seo title="Nytt lösenord" />
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-md">
          <h2 className="text-2xl font-display font-bold text-text text-center mb-2">
            Nytt lösenord
          </h2>
          <p className="text-text-muted text-center text-sm mb-6">
            Välj ett nytt lösenord för ditt konto.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {errors.root && (
              <Alert variant="error">{errors.root.message}</Alert>
            )}

            <Field
              id="reset-password"
              label="Nytt lösenord"
              error={errors.password?.message}
              hint={<PasswordStrength value={password} />}
            >
              {(field) => (
                <PasswordInput
                  {...field}
                  {...register("password")}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              )}
            </Field>

            <Field
              id="reset-confirm"
              label="Bekräfta lösenord"
              error={errors.confirmPassword?.message}
            >
              {(field) => (
                <PasswordInput
                  {...field}
                  {...register("confirmPassword")}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              )}
            </Field>

            <Button type="submit" block disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner size="sm" tone="onDark" label="Uppdaterar" />
              ) : (
                "Uppdatera lösenord"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-text-muted hover:text-text text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Tillbaka till inloggning
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
