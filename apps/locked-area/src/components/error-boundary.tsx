import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  /** Incremented on retry to force React to remount the entire subtree. */
  retryKey: number;
}

/**
 * Catches render errors in lazy-loaded pages and shows a branded fallback.
 * React requires class components for error boundaries.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryKey: 0 };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true, retryKey: 0 };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  private handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      retryKey: prev.retryKey + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="flex min-h-[60vh] items-center justify-center px-6 bg-surface text-text">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-red-light text-brand-red mb-6">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-display font-extrabold text-text mb-3">
              Något gick fel
            </h1>
            <p className="text-text-muted leading-relaxed mb-8">
              Ett oväntat fel uppstod. Försök igen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="font-display font-semibold"
                onClick={this.handleRetry}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Försök igen
              </Button>
              <Button asChild size="lg" className="font-display font-semibold">
                <Link to="/">Till startsidan</Link>
              </Button>
            </div>
          </div>
        </section>
      );
    }

    return <div key={this.state.retryKey}>{this.props.children}</div>;
  }
}
