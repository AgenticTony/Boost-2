"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type Props = {
  src: string;
  alt: string;
  /** Parallax speed multiplier (default 0.3). Higher = more movement. */
  speed?: number;
  className?: string;
  /** Intrinsic pixel dimensions - helps the browser reserve space (CLS). */
  width?: number;
  height?: number;
};

/**
 * ParallaxImage - applies a scroll-based vertical offset to an image,
 * creating a parallax depth effect. Disabled on mobile and when the user
 * prefers reduced motion.
 */
export function ParallaxImage({ src, alt, speed = 0.3, className, width, height }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // speed controls parallax intensity: higher = more vertical offset
  const offset = `${speed * 30}%`;
  const y = useTransform(scrollYProgress, [0, 1], [`-${offset}`, offset]);

  // Disable parallax for reduced-motion users
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ y, scale: 1.15 }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
