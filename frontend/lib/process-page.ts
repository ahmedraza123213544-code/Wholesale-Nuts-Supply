export const processJourneySteps = [
  {
    step: "01",
    title: "Explore Products",
    description:
      "Browse our wholesale nut and product range—almonds, cashews, pistachios, walnuts, dry dates, and more—then select the grades and formats that fit your business.",
    detail: "Catalog browsing · Grade selection · Volume planning",
    icon: "ShoppingBag",
    image: "/products/mixed-nuts.jpg",
    imageAlt: "Wholesale nut assortment ready for catalog browsing",
  },
  {
    step: "02",
    title: "Request a Quote",
    description:
      "Share your requirements, quantities, packaging preferences, and delivery details so we can prepare an accurate wholesale response.",
    detail: "Quantities · Packaging · Destination",
    icon: "FileText",
    image: "/products/hero-nuts.jpg",
    imageAlt: "Premium nuts prepared for wholesale quote requests",
  },
  {
    step: "03",
    title: "Get Wholesale Pricing",
    description:
      "Our team reviews your requirements and provides appropriate wholesale pricing with clear order details you can plan around.",
    detail: "Pricing review · Availability · Order clarity",
    icon: "BadgeDollarSign",
    image: "/products/cashews.jpg",
    imageAlt: "Cashews representing wholesale pricing programs",
  },
  {
    step: "04",
    title: "Confirm Your Order",
    description:
      "Confirm products, quantities, packaging, pricing, and delivery requirements before preparation begins.",
    detail: "Specs locked · Timeline agreed · Ready to prepare",
    icon: "BadgeCheck",
    image: "/products/almonds.jpg",
    imageAlt: "Almonds ready for confirmed wholesale orders",
  },
  {
    step: "05",
    title: "Quality & Preparation",
    description:
      "Products are carefully selected, inspected, prepared, and packaged according to your order requirements.",
    detail: "Selection · Inspection · Packaging",
    icon: "PackageCheck",
    image: "/products/quality-nuts.jpg",
    imageAlt: "Nuts undergoing quality inspection and preparation",
  },
  {
    step: "06",
    title: "Delivery",
    description:
      "Your completed order is prepared for reliable delivery to your business with clear communication through fulfillment.",
    detail: "Outbound prep · Transit coordination · Arrival readiness",
    icon: "Truck",
    image: "/products/cta-nuts.jpg",
    imageAlt: "Packaged wholesale nuts ready for delivery",
  },
  {
    step: "07",
    title: "Build a Long-Term Partnership",
    description:
      "We focus on consistent supply, professional service, and wholesale relationships that support reorders and growth.",
    detail: "Reorder support · Ongoing supply · Account care",
    icon: "Handshake",
    image: "/products/pistachios.jpg",
    imageAlt: "Pistachios representing long-term wholesale partnerships",
  },
] as const;

export const processQualityChain = [
  {
    title: "Source",
    description: "Select product aligned to your grade and volume needs.",
    icon: "MapPin",
  },
  {
    title: "Inspect",
    description: "Review condition and consistency before preparation.",
    icon: "SearchCheck",
  },
  {
    title: "Prepare",
    description: "Handle and stage product carefully for your order.",
    icon: "Settings2",
  },
  {
    title: "Package",
    description: "Secure packaging that protects quality in transit.",
    icon: "Package",
  },
  {
    title: "Deliver",
    description: "Coordinate fulfillment so quality arrives intact.",
    icon: "Truck",
  },
] as const;

export const processAudience = [
  {
    title: "Retailers",
    description: "Clear ordering and consistent packs for shelf-ready programs.",
    icon: "Store",
  },
  {
    title: "Supermarkets",
    description: "Volume-friendly quoting and replenishment-minded fulfillment.",
    icon: "ShoppingCart",
  },
  {
    title: "Restaurants",
    description: "Reliable specs so menus stay consistent service after service.",
    icon: "UtensilsCrossed",
  },
  {
    title: "Bakeries",
    description: "Order clarity around grades and formats that affect bake quality.",
    icon: "Croissant",
  },
  {
    title: "Food manufacturers",
    description: "Structured quoting and preparation for production calendars.",
    icon: "Factory",
  },
  {
    title: "Distributors",
    description: "Professional fulfillment that protects your downstream accounts.",
    icon: "Boxes",
  },
  {
    title: "Large-volume buyers",
    description: "A process designed for scale—without losing communication quality.",
    icon: "Layers",
  },
] as const;

export const processDifferentiators = [
  {
    title: "Simple ordering",
    description: "A clear path from catalog to confirmation—no unnecessary complexity.",
    icon: "Sparkles",
  },
  {
    title: "Clear communication",
    description: "Requirements, pricing, and timelines discussed before preparation starts.",
    icon: "MessagesSquare",
  },
  {
    title: "Reliable supply",
    description: "Built for recurring wholesale needs, not only one-off shipments.",
    icon: "Warehouse",
  },
  {
    title: "Quality-focused handling",
    description: "Inspection and preparation stay part of the journey—not an afterthought.",
    icon: "ShieldCheck",
  },
  {
    title: "Flexible wholesale requirements",
    description: "Packaging and order structure adapted to how your business actually buys.",
    icon: "SlidersHorizontal",
  },
  {
    title: "Professional fulfillment",
    description: "Outbound prep focused on accuracy, protection, and arrival readiness.",
    icon: "ClipboardCheck",
  },
  {
    title: "Long-term customer support",
    description: "Service that continues after delivery—through reorders and program growth.",
    icon: "Headset",
  },
] as const;

/** Illustrative placeholders until verified metrics are published. */
export const processStats = [
  { value: 25, suffix: "+", label: "Years of experience", note: "Illustrative" },
  { value: 1200, suffix: "+", label: "Wholesale customers", note: "Illustrative" },
  { value: 180, suffix: "+", label: "Products available", note: "Illustrative" },
  { value: 50000, suffix: "+", label: "Orders supplied", note: "Illustrative" },
  { value: 40, suffix: "+", label: "Delivery coverage cities", note: "Illustrative" },
] as const;
