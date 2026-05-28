import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Direction the element enters from (default "up") */
  direction?: "up" | "left" | "right";
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: Props) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const initial = (() => {
    switch (direction) {
      case "left":
        return { opacity: 0, x: -30 };
      case "right":
        return { opacity: 0, x: 30 };
      case "up":
      default:
        return { opacity: 0, y: 30 };
    }
  })();

  const animate = (() => {
    switch (direction) {
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      case "up":
      default:
        return { opacity: 1, y: 0 };
    }
  })();

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
