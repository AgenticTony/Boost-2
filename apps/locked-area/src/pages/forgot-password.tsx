import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/auth/use-auth";
import { emailSchema } from "@/lib/password-policy";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Seo } from "@/components/seo";

const schema = z.object({ email: emailSchema });
type Values = z.infer<typeof schema>;

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: Values) => {
    const result = await resetPassword(values.email);
    if (result.success) {
      setSent(true);
    } else {
      setError("root", { message: result.error || "Ett fel uppstod." });
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
        <Card className="w-full max-w-md p-8 text-center shadow-md">
          <div className="w-12 h-12 rounded-input bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-success" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-display font-bold text-text mb-2">
            E-post skickad!
          </h2>
          {/* Deliberately does not confirm whether the address exists - that
              would turn this form into an account-enumeration oracle. */}
          <p className="text-text-muted text-sm mb-6">
            Om ett konto finns med denna e-postadress har vi skickat en
            återställningslänk. Kontrollera din inkorg (och skräppost).
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-brand-red hover:text-brand-red/80 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Tillbaka till inloggning
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
      <Seo title="Glömt lösenord" />
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-md">
          <h2 className="text-2xl font-display font-bold text-text text-center mb-2">
            Glömt lösenord?
          </h2>
          <p className="text-text-muted text-center text-sm mb-6">
            Ange din e-postadress så skickar vi en länk för att återställa ditt
            lösenord.
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
              id="forgot-email"
              label="E-post"
              error={errors.email?.message}
            >
              {(field) => (
                <Input
                  {...field}
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="din@email.se"
                  icon={Mail}
                />
              )}
            </Field>

            <Button type="submit" block disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner size="sm" tone="onDark" label="Skickar" />
              ) : (
                "Skicka återställningslänk"
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
