import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/auth/use-auth";
import { emailSchema, passwordSchema } from "@/lib/password-policy";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

const registerSchema = z
  .object({
    name: z.string().min(1, "Namn är obligatoriskt"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Bekräfta ditt lösenord"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm({
  onSuccess,
  onLoginClick,
}: {
  onSuccess: (message: string) => void;
  onLoginClick: () => void;
}) {
  const { register: registerAccount } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = useWatch({ control, name: "password" });

  const onSubmit = async (values: RegisterValues) => {
    const result = await registerAccount(
      values.name,
      values.email,
      values.password,
    );

    if (result.success) {
      onSuccess("Konto skapat! Kolla din e-post för att verifiera ditt konto.");
    } else {
      // Surfaced through the form's own error slot rather than a page-level
      // banner, so it sits next to the control that caused it.
      setError("root", {
        message: result.error || "Registrering misslyckades",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {errors.root && <Alert variant="error">{errors.root.message}</Alert>}

      <Field id="reg-name" label="Namn" error={errors.name?.message}>
        {(field) => (
          <Input
            {...field}
            {...register("name")}
            type="text"
            autoComplete="name"
            placeholder="Ditt namn"
            icon={User}
          />
        )}
      </Field>

      <Field id="reg-email" label="E-post" error={errors.email?.message}>
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
        id="reg-password"
        label="Lösenord"
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
        id="reg-confirm"
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
          <Spinner size="sm" tone="onDark" label="Skapar konto" />
        ) : (
          <>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            Skapa konto
          </>
        )}
      </Button>

      <p className="text-center text-sm text-text-muted">
        Har du redan ett konto?{" "}
        <button
          type="button"
          onClick={onLoginClick}
          className="text-brand-red hover:text-brand-red/80 font-medium"
        >
          Logga in
        </button>
      </p>
    </form>
  );
}
