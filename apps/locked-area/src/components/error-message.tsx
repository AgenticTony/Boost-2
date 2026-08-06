import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-brand-red-light border border-brand-red/20 rounded-card p-6 max-w-md text-center">
        <AlertCircle className="w-8 h-8 text-brand-red mx-auto mb-3" />
        <p className="text-error">{message}</p>
      </div>
    </div>
  );
}
