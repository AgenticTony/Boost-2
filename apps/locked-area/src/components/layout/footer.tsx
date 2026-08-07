import { Link } from "react-router-dom";
import { Mail, ExternalLink } from "lucide-react";

const PUBLIC_SITE_URL = "https://boostbyfcr.se";
const SUPPORT_EMAIL = "kontakt@boostbyfcr.se";

const sections = [
  {
    heading: "Metodmaterial",
    links: [
      { to: "/", label: "Bibliotek" },
      { to: "/handbook", label: "Handböcker" },
      { to: "/knowledge", label: "Kunskapsbanken" },
    ],
  },
  {
    heading: "Stöd",
    links: [{ to: "/resources", label: "Resurser & kontakter" }],
  },
];

/**
 * Footer for the signed-in area.
 *
 * Deliberately shorter than public-site's four-column version: this app has
 * seven routes, and reproducing a marketing footer inside a members area
 * mostly produces links back to pages the member is already on. Policy links
 * point outward to the public site, which is where they are maintained.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-dark text-white mt-auto">
      <div className="container-page py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 mb-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-white mb-4">
                {section.heading}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-white mb-4">
              Kontakt
            </h2>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div>
            <h2 className="font-display font-semibold text-sm uppercase tracking-wider text-white mb-4">
              Boost by FCR
            </h2>
            <a
              href={PUBLIC_SITE_URL}
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              Till startsidan
              <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-white/60">
            © {year} Boost by FC Rosengård — Metodmaterial för deltagare
          </p>
          <a
            href={`${PUBLIC_SITE_URL}/dataskyddspolicy`}
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            Dataskyddspolicy
          </a>
        </div>
      </div>
    </footer>
  );
}
