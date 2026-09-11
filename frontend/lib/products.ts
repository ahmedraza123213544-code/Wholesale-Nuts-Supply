export type ProductAvailability = "In Stock" | "Limited" | "Made to Order";

export type ProductCategory = string;

export type ProductType =
  | "Raw"
  | "Roasted"
  | "Blanched"
  | "In-Shell"
  | "Mixed"
  | "Dried"
  | string;

export type CatalogProduct = {
  id?: number | string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryId?: number | string | null;
  type: ProductType;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  grade: string;
  packaging: string[];
  sizes: string[];
  moq: string;
  availability: ProductAvailability | string;
  featured?: boolean;
  specifications: { label: string; value: string }[];
  qualityNotes: string[];
  wholesaleInfo: string;
};

export const productTypes: Array<"All" | string> = [
  "All",
  "Raw",
  "Roasted",
  "Blanched",
  "In-Shell",
  "Mixed",
  "Dried",
];

export const availabilityOptions: Array<"All" | ProductAvailability> = [
  "All",
  "In Stock",
  "Limited",
  "Made to Order",
];

export const sortOptions = [
  { value: "featured", label: "Featured first" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "availability", label: "Availability" },
] as const;

export type SortOption = (typeof sortOptions)[number]["value"];

export const wholesaleBenefits = [
  {
    title: "Competitive bulk pricing",
    description:
      "Volume-based quotes designed for wholesale margins and repeat programs.",
    icon: "BadgeDollarSign",
  },
  {
    title: "Premium quality",
    description:
      "Grade-focused selection that protects shelf appeal and production consistency.",
    icon: "ShieldCheck",
  },
  {
    title: "Large-volume orders",
    description:
      "Case, pallet, and ongoing replenishment options for growing operations.",
    icon: "Package",
  },
  {
    title: "Reliable supply",
    description:
      "Inventory planning and sourcing support for predictable procurement cycles.",
    icon: "Warehouse",
  },
  {
    title: "Flexible packaging",
    description:
      "Pack formats adapted to retail, foodservice, manufacturing, and redistribution.",
    icon: "Boxes",
  },
  {
    title: "Consistent quality",
    description:
      "Repeatable standards across lots so reorders feel familiar to your team.",
    icon: "BadgeCheck",
  },
  {
    title: "Reliable delivery",
    description:
      "Coordinated logistics with clear communication from quote to arrival.",
    icon: "Truck",
  },
] as const;
