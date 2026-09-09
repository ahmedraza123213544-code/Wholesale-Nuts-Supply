export const qualityPromiseItems = [
  {
    title: "Premium-quality nuts",
    description:
      "Grade-focused selection that protects appearance, flavor, and wholesale consistency.",
    icon: "ShieldCheck",
  },
  {
    title: "Freshness",
    description:
      "Handled and stored to preserve taste, texture, and usable shelf life for your programs.",
    icon: "Leaf",
  },
  {
    title: "Consistency",
    description:
      "Repeatable standards across lots so procurement and production teams can plan with confidence.",
    icon: "Scale",
  },
  {
    title: "Food safety mindset",
    description:
      "Careful handling practices aligned with wholesale food-supply expectations.",
    icon: "HeartHandshake",
  },
  {
    title: "Careful handling",
    description:
      "From intake to outbound, product is protected against damage, contamination risk, and quality drift.",
    icon: "HandHeart",
  },
  {
    title: "Reliable wholesale supply",
    description:
      "Quality only matters if it arrives when you need it—availability and delivery are part of the promise.",
    icon: "Truck",
  },
] as const;

export const sourcingSteps = [
  {
    step: "01",
    title: "Careful supplier selection",
    description:
      "We work with suppliers who understand wholesale grade expectations and can support ongoing volume.",
  },
  {
    step: "02",
    title: "Premium raw materials",
    description:
      "Lots are chosen for size, color, moisture, and flavor—not just lowest available price.",
  },
  {
    step: "03",
    title: "Quality inspection",
    description:
      "Incoming product is reviewed against agreed visual and handling standards before release.",
  },
  {
    step: "04",
    title: "Freshness checks",
    description:
      "We assess condition and storage readiness so product reaches customers in selling form.",
  },
  {
    step: "05",
    title: "Consistent product standards",
    description:
      "Accepted lots follow the same baseline so reorders feel familiar to your buyers and kitchens.",
  },
] as const;

export const qualityProcessSteps = [
  {
    title: "Source",
    description:
      "Select origins and partners capable of meeting wholesale grade and volume needs.",
    icon: "MapPin",
  },
  {
    title: "Inspect",
    description:
      "Review lots for appearance, condition, and alignment with agreed product standards.",
    icon: "SearchCheck",
  },
  {
    title: "Process",
    description:
      "Handle, sort, and prepare product carefully for the packaging format your program requires.",
    icon: "Settings2",
  },
  {
    title: "Test",
    description:
      "Apply practical quality checks focused on consistency, freshness cues, and readiness to ship.",
    icon: "FlaskConical",
  },
  {
    title: "Package",
    description:
      "Secure packaging designed to protect product integrity through storage and transit.",
    icon: "PackageCheck",
  },
  {
    title: "Deliver",
    description:
      "Coordinate outbound fulfillment so quality arrives intact and on schedule.",
    icon: "Truck",
  },
] as const;

export const freshnessPoints = [
  {
    title: "Freshness",
    description: "Storage practices designed to protect natural flavor and aroma.",
  },
  {
    title: "Taste",
    description: "Handled to avoid staleness and preserve the clean nut character buyers expect.",
  },
  {
    title: "Texture",
    description: "Careful climate and handling support the crunch and mouthfeel of each SKU.",
  },
  {
    title: "Quality",
    description: "Condition is monitored so product remains presentation-ready for retail and foodservice.",
  },
  {
    title: "Shelf life",
    description: "Packaging and rotation habits help customers maximize usable inventory windows.",
  },
] as const;

export const packagingPoints = [
  {
    title: "Secure packaging",
    description: "Formats chosen to reduce breakage and protect product during handling.",
    icon: "Package",
  },
  {
    title: "Bulk-order handling",
    description: "Case, carton, and program packing aligned to wholesale volume needs.",
    icon: "Boxes",
  },
  {
    title: "Product protection",
    description: "Outbound prep focused on keeping nuts clean, intact, and ready to use.",
    icon: "Shield",
  },
  {
    title: "Reliable delivery",
    description: "Coordinated logistics with clear communication from quote to arrival.",
    icon: "Truck",
  },
  {
    title: "Arrival consistency",
    description: "The goal is simple: what you ordered should match what arrives.",
    icon: "BadgeCheck",
  },
] as const;

/** Placeholders only — replace with verified certifications/standards later. */
export const qualityStandardsPlaceholders = [
  {
    title: "Food-safety practices",
    description:
      "Placeholder: add your documented handling, hygiene, and warehouse practices here.",
    status: "To be confirmed",
  },
  {
    title: "Quality testing approach",
    description:
      "Placeholder: describe lot checks, moisture/sensory reviews, or lab partners when available.",
    status: "Details pending",
  },
  {
    title: "Compliance documentation",
    description:
      "Placeholder: list certificates, audit reports, or supplier documents you can share with buyers.",
    status: "Replace with real docs",
  },
  {
    title: "Traceability support",
    description:
      "Placeholder: explain lot tracking and how customers request documentation for their programs.",
    status: "Coming soon",
  },
] as const;

export const qualityWhyMatters = [
  {
    title: "Retailers",
    description:
      "Shelf appeal and fewer returns depend on consistent grade and presentation.",
    icon: "Store",
  },
  {
    title: "Supermarkets",
    description:
      "High-turn assortments need reliable pack quality across repeating orders.",
    icon: "ShoppingCart",
  },
  {
    title: "Restaurants",
    description:
      "Chefs rely on predictable flavor and texture for menus that do not change mid-service.",
    icon: "UtensilsCrossed",
  },
  {
    title: "Bakeries",
    description:
      "Bake performance and garnish quality stay stable when nut specs stay consistent.",
    icon: "Croissant",
  },
  {
    title: "Food manufacturers",
    description:
      "Production lines need uniform inputs to protect yield, taste, and brand reputation.",
    icon: "Factory",
  },
  {
    title: "Distributors",
    description:
      "Downstream customers expect dependable quality that protects your own account relationships.",
    icon: "Boxes",
  },
] as const;

/** Illustrative placeholders — replace with verified operating metrics. */
export const qualityStats = [
  {
    value: 25,
    suffix: "+",
    label: "Years of industry experience",
    note: "Illustrative",
  },
  {
    value: 1200,
    suffix: "+",
    label: "Wholesale customers served",
    note: "Illustrative",
  },
  {
    value: 50000,
    suffix: "+",
    label: "Orders supplied",
    note: "Illustrative",
  },
  {
    value: 100,
    suffix: "%",
    label: "Lots reviewed before release*",
    note: "Process goal",
  },
  {
    value: 6,
    suffix: "",
    label: "Quality process checkpoints",
    note: "Current framework",
  },
] as const;
