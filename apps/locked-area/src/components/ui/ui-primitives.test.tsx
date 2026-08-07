import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Link } from "react-router-dom";
import { Mail, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Spinner, LoadingState } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";

describe("Button", () => {
  it("renders a button with the default pill CTA styling", () => {
    render(<Button>Logga in</Button>);
    const button = screen.getByRole("button", { name: "Logga in" });
    expect(button).toHaveClass("bg-brand-red", "rounded-cta");
  });

  it("does not suppress the app-wide focus outline", () => {
    // index.css defines one focus indicator for the whole app. A primitive
    // that sets focus-visible:outline-none silently opts out of it.
    render(<Button>Fokus</Button>);
    expect(screen.getByRole("button").className).not.toContain("outline-none");
  });

  it("renders as a link when asChild is set", () => {
    render(
      <MemoryRouter>
        <Button asChild>
          <Link to="/">Till startsidan</Link>
        </Button>
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: "Till startsidan" });
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveClass("bg-brand-red");
  });

  it("does not fire onClick while disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Skicka
      </Button>,
    );

    await userEvent.click(screen.getByRole("button"), {
      pointerEventsCheck: 0,
    });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies the rounded shape and success variant", () => {
    render(
      <Button variant="success" shape="rounded">
        Godkänn
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-success", "rounded-input");
    expect(button).not.toHaveClass("rounded-cta");
  });
});

describe("Spinner", () => {
  it("announces itself as a status by default", () => {
    render(<Spinner label="Laddar övningar" />);
    expect(screen.getByRole("status")).toHaveAccessibleName("Laddar övningar");
  });

  it("is hidden from assistive tech when purely decorative", () => {
    const { container } = render(<Spinner label={null} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("LoadingState centres a labelled spinner", () => {
    render(<LoadingState label="Laddar sidan" />);
    expect(screen.getByRole("status")).toHaveAccessibleName("Laddar sidan");
  });
});

describe("Alert", () => {
  it("is announced as an alert", () => {
    render(<Alert variant="error">Felaktig e-post eller lösenord</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Felaktig e-post eller lösenord",
    );
  });

  it("styles success separately from error", () => {
    const { rerender } = render(<Alert variant="error">fel</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("text-error");

    rerender(<Alert variant="success">klart</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("text-success");
  });
});

describe("Input", () => {
  it("associates with a Label via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">E-post</Label>
        <Input id="email" icon={Mail} />
      </>,
    );
    expect(screen.getByLabelText("E-post")).toBeInTheDocument();
  });

  it("leaves room for a leading icon", () => {
    render(<Input aria-label="E-post" icon={Mail} />);
    expect(screen.getByLabelText("E-post")).toHaveClass("pl-10");
  });

  it("uses flush padding with no icon", () => {
    render(<Input aria-label="Sök" />);
    const input = screen.getByLabelText("Sök");
    expect(input).toHaveClass("pl-4", "pr-4");
  });

  it("renders a trailing adornment", () => {
    render(
      <Input
        aria-label="Lösenord"
        adornment={
          <button type="button" aria-label="Visa lösenord">
            <Eye className="w-4 h-4" />
          </button>
        }
      />,
    );
    expect(
      screen.getByRole("button", { name: "Visa lösenord" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Lösenord")).toHaveClass("pr-10");
  });
});

describe("Card", () => {
  it("renders the shared panel treatment", () => {
    render(<Card data-testid="panel">innehåll</Card>);
    expect(screen.getByTestId("panel")).toHaveClass(
      "bg-card",
      "border-border",
      "rounded-card",
    );
  });
});
