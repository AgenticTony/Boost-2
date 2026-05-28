import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Input className="my-custom" placeholder="test" />);
    expect(screen.getByPlaceholderText("test").className).toContain(
      "my-custom",
    );
  });

  it("defaults to text type (HTML default)", () => {
    render(<Input placeholder="test" />);
    const input = screen.getByPlaceholderText("test") as HTMLInputElement;
    // HTML input defaults to type="text" when omitted
    expect(input.type).toBe("text");
  });

  it("accepts different type attribute", () => {
    render(<Input type="email" placeholder="email" />);
    expect(screen.getByPlaceholderText("email")).toHaveAttribute(
      "type",
      "email",
    );
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="name" />);
    const input = screen.getByPlaceholderText("name");
    await user.type(input, "Anna");
    expect(input).toHaveValue("Anna");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled placeholder="test" />);
    expect(screen.getByPlaceholderText("test")).toBeDisabled();
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<Input ref={ref} placeholder="test" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
