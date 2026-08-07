import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/auth/use-auth";
import { emailSchema } from "@/lib/password-policy";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

const loginSchema = z.object({
  email: emailSchema,
  // Deliberately not the full policy: an existing account may predate it, and
  // rejecting a correct password locally would lock the member out of their
  // own account.
  password: z.string().min(1, "Lösenord är obligatoriskt"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm({
  onRegisterClick,
}: {
  onRegisterClick: () => void;
}) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setFormError("");
    const result = await login(values.email, values.password);

    if (result.success) {
      // `login` has already entered the provider's loading state, so the guard
      // on "/" shows a spinner until the profile lands rather than reading the
      // in-flight fetch as "not signed in".
      navigate("/", { replace: true });
    } else {
      setFormError(result.error || "Inloggning misslyckades");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {formError && <Alert variant="error">{formError}</Alert>}

      <Field id="login-email" label="E-post" error={errors.email?.message}>
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

      <Field
        id="login-password"
        label="Lösenord"
        error={errors.password?.message}
      >
        {(field) => (
          <PasswordInput
            {...field}
            {...register("password")}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        )}
      </Field>

      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-sm text-brand-red hover:text-brand-red/80 font-medium"
        >
          Glömt lösenord?
        </Link>
      </div>

      <Button type="submit" block disabled={isSubmitting}>
        {isSubmitting ? (
          <Spinner size="sm" tone="onDark" label="Loggar in" />
        ) : (
          <>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            Logga in
          </>
        )}
      </Button>

      <p className="text-center text-sm text-text-muted">
        Har du inget konto?{" "}
        <button
          type="button"
          onClick={onRegisterClick}
          className="text-brand-red hover:text-brand-red/80 font-medium"
        >
          Skapa ett här
        </button>
      </p>
    </form>
  );
}
