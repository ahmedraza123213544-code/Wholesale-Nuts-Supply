"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SiteLogo } from "@/components/layout/site-logo";

gsap.registerPlugin(useGSAP);

export function PageLoader({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        setVisible(false);
        onComplete?.();
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          onComplete?.();
        },
      });

      tl.fromTo(
        ".page-loader__logo",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out" }
      )
        .to(".page-loader__bar", {
          scaleX: 1,
          duration: 0.9,
          ease: "power2.inOut",
        })
        .to(".page-loader", {
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.inOut",
          delay: 0.15,
        });
    },
    { scope: root }
  );

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={root}
      className="page-loader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory"
      aria-hidden="true"
    >
      <div className="page-loader__logo opacity-0">
        <SiteLogo href={undefined} size="loader" priority />
      </div>
      <div className="mt-8 h-px w-40 overflow-hidden bg-forest/15">
        <div className="page-loader__bar h-full w-full origin-left scale-x-0 bg-gold" />
      </div>
    </div>
  );
}
