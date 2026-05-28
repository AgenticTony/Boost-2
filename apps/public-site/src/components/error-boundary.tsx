import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

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
        <section className="flex min-h-[60vh] items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-red/10 text-brand-red mb-6">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-display font-extrabold text-text mb-3">
              Något gick fel
            </h1>
            <p className="text-text-muted leading-relaxed mb-8">
              Ett oväntat fel uppstod. Försök igen eller gå tillbaka till
              startsidan.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                className="bg-white text-text hover:bg-muted font-display font-semibold rounded-cta border border-border"
                onClick={this.handleRetry}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Försök igen
              </Button>
              <Button
                asChild
                className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-cta"
              >
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
