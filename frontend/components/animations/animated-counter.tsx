"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
};

export function AnimatedCounter({
  value,
  suffix = "",
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const obj = { n: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;
          gsap.to(obj, {
            n: value,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${obj.n.toFixed(decimals)}${suffix}`;
            },
          });
        },
      });
    },
    { dependencies: [value, suffix, decimals] }
  );

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
