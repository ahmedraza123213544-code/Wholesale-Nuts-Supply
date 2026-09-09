"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchCategories, fetchProductBySlug } from "@/lib/product-api";
import { businessTypes, orderQuantities } from "@/lib/site-data";
import {
  getZodFieldErrors,
  inquiryFormSchema,
  type InquiryFormValues,
} from "@/lib/validations/inquiry";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FormState = InquiryFormValues;
type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  businessType: "",
  productInterest: "",
  orderQuantity: "",
  message: "",
};

export function ContactInquiryForm() {
  const root = useRef<HTMLElement>(null);
  const searchParams = useSearchParams();
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [interestOptions, setInterestOptions] = useState<string[]>([
    "Multiple / Custom Mix",
  ]);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  useEffect(() => {
    let mounted = true;
    fetchCategories()
      .then((categories) => {
        if (!mounted) return;
        const names = categories.map((item) => item.name);
        setInterestOptions([...names, "Multiple / Custom Mix"]);
      })
      .catch(() => {
        // Keep fallback option if categories API fails.
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const slug = searchParams.get("product");
    if (!slug) return;

    let mounted = true;
    fetchProductBySlug(slug)
      .then(({ product }) => {
        if (!mounted || !product) return;

        setValues((prev) => ({
          ...prev,
          productInterest: product.category || "Multiple / Custom Mix",
          message: prev.message.trim()
            ? prev.message
            : `I'm interested in wholesale pricing for ${product.name}.`,
        }));
      })
      .catch(() => {
        // Ignore prefills if product API is unavailable.
      });

    return () => {
      mounted = false;
    };
  }, [searchParams]);

  useGSAP(
    () => {
      gsap.fromTo(
        ".inquiry-panel",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
          },
        }
      );
    },
    { scope: root }
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = inquiryFormSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(getZodFieldErrors(parsed.error));
      return;
    }

    setSubmitting(true);
    try {
      const { submitInquiry } = await import("@/lib/product-api");
      await submitInquiry(parsed.data);
      setSubmitted(true);
      setValues(initialState);
    } catch (error) {
      setErrors({
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit inquiry. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="inquiry-form"
      ref={root}
      className="relative overflow-hidden bg-stone/50 section-pad"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-page relative grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal>
          <Badge variant="forest">Wholesale Inquiry</Badge>
          <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
            Request pricing for your next order.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Share your business details and volume needs. We review every
            inquiry personally and respond with clear next steps.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink/80">
            {[
              "Typical response within one business day",
              "Quotes tailored to grade, format, and destination",
              "Support for first orders and ongoing programs",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="inquiry-panel opacity-0 rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.4)] md:p-8">
          {submitted ? (
            <div className="flex min-h-[28rem] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-3xl text-ink">
                Inquiry received
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Thank you. Our wholesale team will review your requirements and
                follow up shortly with pricing and availability.
              </p>
              <Button
                className="mt-8"
                variant="darkOutline"
                onClick={() => setSubmitted(false)}
              >
                Send another inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  id="fullName"
                  label="Full Name"
                  error={errors.fullName}
                >
                  <Input
                    id="fullName"
                    value={values.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="Your full name"
                    aria-invalid={Boolean(errors.fullName)}
                  />
                </Field>
                <Field
                  id="companyName"
                  label="Company Name"
                  error={errors.companyName}
                >
                  <Input
                    id="companyName"
                    value={values.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                    placeholder="Business / brand name"
                    aria-invalid={Boolean(errors.companyName)}
                  />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field id="email" label="Email" error={errors.email}>
                  <Input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@company.com"
                    aria-invalid={Boolean(errors.email)}
                  />
                </Field>
                <Field id="phone" label="Phone" error={errors.phone}>
                  <Input
                    id="phone"
                    value={values.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="0336 2500357"
                    aria-invalid={Boolean(errors.phone)}
                  />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  id="businessType"
                  label="Business Type"
                  error={errors.businessType}
                >
                  <Select
                    value={values.businessType}
                    onValueChange={(value) => update("businessType", value)}
                  >
                    <SelectTrigger
                      id="businessType"
                      aria-invalid={Boolean(errors.businessType)}
                    >
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field
                  id="productInterest"
                  label="Products Interested In"
                  error={errors.productInterest}
                >
                  <Select
                    value={values.productInterest}
                    onValueChange={(value) => update("productInterest", value)}
                  >
                    <SelectTrigger
                      id="productInterest"
                      aria-invalid={Boolean(errors.productInterest)}
                    >
                      <SelectValue placeholder="Select products" />
                    </SelectTrigger>
                    <SelectContent>
                      {interestOptions.map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field
                id="orderQuantity"
                label="Estimated Order Quantity"
                error={errors.orderQuantity}
              >
                <Select
                  value={values.orderQuantity}
                  onValueChange={(value) => update("orderQuantity", value)}
                >
                  <SelectTrigger
                    id="orderQuantity"
                    aria-invalid={Boolean(errors.orderQuantity)}
                  >
                    <SelectValue placeholder="Select estimated volume" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderQuantities.map((qty) => (
                      <SelectItem key={qty} value={qty}>
                        {qty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field id="message" label="Message" error={errors.message}>
                <Textarea
                  id="message"
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Share grades, packaging, delivery location, and timeline..."
                  aria-invalid={Boolean(errors.message)}
                />
              </Field>

              {hasErrors ? (
                <p className="text-sm text-red-600" role="alert">
                  Please review the highlighted fields and try again.
                </p>
              ) : null}

              <Button
                type="submit"
                size="xl"
                className="min-w-[180px] w-full sm:w-auto"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    Sending…
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Inquiry
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      <p
        className={cn(
          "min-h-5 text-xs text-red-600 transition-opacity",
          error ? "opacity-100" : "opacity-0"
        )}
      >
        {error || " "}
      </p>
    </div>
  );
}
