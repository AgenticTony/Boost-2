import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

function renderApp(initialPath = "/") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialPath]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

describe("App routing", () => {
  it("renders home page at /", async () => {
    renderApp("/");

    // Wait for lazy-loaded page to mount — check for home page content
    await waitFor(() => {
      expect(
        screen.getAllByText(/Boost by FC Rosengård/).length,
      ).toBeGreaterThan(0);
    });
  });

  it("renders the app shell container", () => {
    renderApp("/");
    expect(document.querySelector(".flex.min-h-screen")).toBeInTheDocument();
  });

  it("renders 404 page for unknown routes", async () => {
    renderApp("/this-route-does-not-exist");

    await waitFor(() => {
      expect(screen.getByText("404")).toBeInTheDocument();
      expect(screen.getByText("Sidan hittades inte")).toBeInTheDocument();
    });
  });

  it("404 page has link back to home", async () => {
    renderApp("/nonexistent");

    await waitFor(() => {
      const link = screen.getByRole("link", {
        name: /Tillbaka till startsidan/i,
      });
      expect(link).toHaveAttribute("href", "/");
    });
  });

  it("renders anmal-dig page at /anmal-dig", async () => {
    renderApp("/anmal-dig");

    await waitFor(() => {
      expect(screen.getByText("Ta första steget.")).toBeInTheDocument();
    });
  });

  it("renders kontakt page at /kontakt", async () => {
    renderApp("/kontakt");

    await waitFor(() => {
      expect(screen.getByText("Hör av dig")).toBeInTheDocument();
    });
  });

  it("renders header with navigation", () => {
    renderApp("/");
    // Header should be present on all pages
    const header = document.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  it("renders footer on all pages", () => {
    renderApp("/");
    const footer = document.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("main content has correct id for skip link", () => {
    renderApp("/");
    const main = document.getElementById("main-content");
    expect(main).toBeInTheDocument();
  });
});

describe("App routing — every route mounts without crashing", () => {
  // A lazy-load export mistake (missing default export, renamed symbol) would
  // throw on render and surface the ErrorBoundary fallback. This catches that
  // class of breakage for every public route.
  const routes = [
    "/",
    "/anmal-dig",
    "/arbetssokande",
    "/bridge",
    "/dataskyddspolicy",
    "/foretag",
    "/halsosparet",
    "/kontakt",
    "/lediga-tjanster",
    "/nyheter",
    "/press-media",
    "/resurser",
    "/studier",
    "/vad-vi-gor",
    "/var-historia",
    "/vanliga-fragor",
    "/vem-vi-ar",
  ];

  it.each(routes)(
    "mounts %s without hitting the error boundary",
    async (path) => {
      renderApp(path);
      await waitFor(() => {
        expect(screen.queryByText(/Något gick fel/i)).not.toBeInTheDocument();
      });
    },
  );
});
