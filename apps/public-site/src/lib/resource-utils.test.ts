import { describe, it, expect } from "vitest";
import {
  formatFileSize,
  getFileExtension,
  resourceCategoryLabels,
  resourceCategoryColors,
  resourceCategoryIcons,
} from "./resource-utils";

describe("formatFileSize", () => {
  it("returns empty string for undefined", () => {
    expect(formatFileSize(undefined)).toBe("");
  });

  it("returns empty string for 0 (falsy)", () => {
    expect(formatFileSize(0)).toBe("");
  });

  it("formats bytes", () => {
    expect(formatFileSize(512)).toBe("512 B");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(800_000)).toBe("781 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1.0 MB");
    expect(formatFileSize(2_400_000)).toBe("2.3 MB");
  });

  it("formats max resource size from mock data", () => {
    expect(formatFileSize(4_200_000)).toBe("4.0 MB");
  });
});

describe("getFileExtension", () => {
  it("returns undefined for undefined input", () => {
    expect(getFileExtension(undefined)).toBeUndefined();
  });

  it("extracts extension in uppercase", () => {
    expect(getFileExtension("guide.pdf")).toBe("PDF");
    expect(getFileExtension("photo.jpeg")).toBe("JPEG");
  });

  it("returns undefined for file with no extension", () => {
    expect(getFileExtension("README")).toBeUndefined();
  });

  it("handles multi-dot filenames", () => {
    expect(getFileExtension("my.report.final.pdf")).toBe("PDF");
  });
});

describe("resourceCategoryLabels", () => {
  it("has label for every known category", () => {
    expect(resourceCategoryLabels.alla).toBe("Alla");
    expect(resourceCategoryLabels.normer).toBe("Normer");
    expect(resourceCategoryLabels.halsa).toBe("Hälsa");
    expect(resourceCategoryLabels.arbetsmarknad).toBe("Arbetsmarknad");
    expect(resourceCategoryLabels.handbocker).toBe("Handböcker");
  });

  it("has exactly 5 categories", () => {
    expect(Object.keys(resourceCategoryLabels)).toHaveLength(5);
  });
});

describe("resourceCategoryColors", () => {
  it("has color classes for each content category", () => {
    expect(resourceCategoryColors.normer).toContain("purple");
    expect(resourceCategoryColors.halsa).toContain("emerald");
    expect(resourceCategoryColors.arbetsmarknad).toContain("amber");
    expect(resourceCategoryColors.handbocker).toContain("blue");
  });
});

describe("resourceCategoryIcons", () => {
  it("maps each category to a lucide icon name", () => {
    expect(resourceCategoryIcons.normer).toBe("MessageSquare");
    expect(resourceCategoryIcons.halsa).toBe("Heart");
    expect(resourceCategoryIcons.arbetsmarknad).toBe("Briefcase");
    expect(resourceCategoryIcons.handbocker).toBe("BookOpen");
  });
});
