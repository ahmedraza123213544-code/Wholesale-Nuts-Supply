import { Mail, MapPin, Phone } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { Separator } from "@/components/ui/separator";
import { navLinks, siteConfig, socialLinks } from "@/lib/site-data";

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-forest/10 bg-ivory text-ink"
      id="contact"
    >
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-forest/8 blur-3xl" />

      <div className="container-page relative section-pad !pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <SiteLogo size="footer" />
            <p className="mt-4 text-sm text-forest/70">{siteConfig.tagline}</p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Supplying premium nuts to retailers, manufacturers, and foodservice
              partners who expect quality, documentation, and delivery they can
              plan around.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-forest">Navigate</h2>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition hover:text-forest"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl text-forest">Contact</h2>
            <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                <a href={siteConfig.phoneHref} className="hover:text-forest">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-forest"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
            <p className="mt-5 text-xs tracking-wide text-muted-foreground/80">
              {siteConfig.hours}
            </p>
          </div>
        </div>

        <Separator className="my-10 bg-forest/10" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-xs tracking-[0.18em] uppercase text-forest/55 transition hover:text-forest"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
