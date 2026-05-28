import { motion, useReducedMotion } from "framer-motion";

const promises = [
  {
    src: "/images/promise-inkluderande.png",
    label: "Inkluderande",
  },
  {
    src: "/images/promise-passionsdrivna.png",
    label: "Passionsdrivna",
  },
  {
    src: "/images/promise-handlingskraft.png",
    label: "Handlingskraft",
  },
  {
    src: "/images/promise-inspirerar.png",
    label: "Inspirerar",
  },
  {
    src: "/images/promise-kopplarsaman.png",
    label: "Kopplar samman",
  },
];

type Props = {
  className?: string;
};

/**
 * PromiseIcons - renders the five Boost brand promise icons
 * in a horizontal row with labels, staggered entrance animation.
 */
export function PromiseIcons({ className }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`flex flex-wrap justify-center gap-6 md:gap-10 ${className ?? ""}`}
    >
      {promises.map((p, i) => (
        <motion.div
          key={p.label}
          className="flex flex-col items-center gap-2"
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: {
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: "easeOut" as const,
                },
              })}
        >
          <div className="flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-brand-red/10">
            <img
              src={p.src}
              alt={p.label}
              className="h-10 w-10 md:h-12 md:w-12 object-contain"
            />
          </div>
          <span className="text-xs font-display font-semibold text-text-muted text-center">
            {p.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
