import { z } from "zod";

export const inquiryFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  companyName: z.string().trim().min(2, "Company name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Phone number is required."),
  businessType: z.string().trim().min(1, "Select a business type."),
  productInterest: z.string().trim().min(1, "Select a product interest."),
  orderQuantity: z.string().trim().min(1, "Select an estimated quantity."),
  message: z
    .string()
    .trim()
    .min(12, "Please share a short message (at least 12 characters)."),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

export function getZodFieldErrors(error: z.ZodError) {
  const fieldErrors: Partial<Record<keyof InquiryFormValues, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key as keyof InquiryFormValues]) {
      fieldErrors[key as keyof InquiryFormValues] = issue.message;
    }
  }
  return fieldErrors;
}
