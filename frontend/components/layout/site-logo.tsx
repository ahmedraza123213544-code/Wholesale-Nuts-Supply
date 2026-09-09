import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  size?: "nav" | "footer" | "loader";
};

const sizeMap = {
  nav: {
    width: 320,
    height: 160,
    image: "h-14 w-auto object-contain sm:h-16 lg:h-[4.5rem]",
  },
  footer: {
    width: 360,
    height: 180,
    image: "h-[4.5rem] w-auto object-contain sm:h-20",
  },
  loader: {
    width: 420,
    height: 210,
    image: "h-28 w-auto object-contain sm:h-32",
  },
} as const;

export function SiteLogo({
  href = "/",
  className,
  imageClassName,
  priority = false,
  size = "nav",
}: SiteLogoProps) {
  const config = sizeMap[size];

  const mark = (
    <Image
      src="/new-logo.png"
      alt={siteConfig.name}
      width={config.width}
      height={config.height}
      priority={priority}
      className={cn(config.image, imageClassName, className)}
    />
  );

  if (!href) return mark;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center"
      aria-label={`${siteConfig.name} home`}
    >
      {mark}
    </Link>
  );
}
