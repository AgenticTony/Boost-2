import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll position to the top of the page on every route change.
 *
 * React Router does not restore scroll position on navigation, so without this
 * a click-through inherits the previous page's scroll offset (often the bottom).
 * If the destination URL carries a hash that matches an element id, that element
 * is scrolled into view instead - preserving intentional in-page anchor jumps.
 *
 * Must be rendered inside a <Router> (BrowserRouter / MemoryRouter).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
