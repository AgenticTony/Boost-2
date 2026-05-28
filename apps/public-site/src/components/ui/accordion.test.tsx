import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";

function renderAccordion() {
  return render(
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Fråga 1</AccordionTrigger>
        <AccordionContent>Svar 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Fråga 2</AccordionTrigger>
        <AccordionContent>Svar 2</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe("Accordion", () => {
  it("renders all triggers", () => {
    renderAccordion();
    expect(screen.getByText("Fråga 1")).toBeInTheDocument();
    expect(screen.getByText("Fråga 2")).toBeInTheDocument();
  });

  it("content is hidden by default", () => {
    renderAccordion();
    // Radix renders both regions with hidden attr when collapsed
    const regions = screen.getAllByRole("region", { hidden: true });
    expect(regions).toHaveLength(2);
    for (const r of regions) {
      expect(r.getAttribute("data-state")).toBe("closed");
    }
  });

  it("expands content on trigger click", async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(screen.getByText("Fråga 1"));

    // First region should be open, second still closed
    const regions = screen.getAllByRole("region", { hidden: true });
    expect(regions[0].getAttribute("data-state")).toBe("open");
    expect(regions[1].getAttribute("data-state")).toBe("closed");
  });

  it("has chevron icon", () => {
    renderAccordion();
    // ChevronDown svg from lucide
    const svg = screen.getByText("Fråga 1").parentElement?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
