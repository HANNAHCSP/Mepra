import type { ProductVariant } from "@prisma/client";

// Define the expected structure of our variant attributes
export type VariantAttributes = {
  size?: string;
  color?: string;
  [key: string]: string | undefined; // Allow for other string-based attributes
};

// Create a new type that overrides Prisma's generic 'JsonValue' 
// for the 'attributes' field with our specific structure.
export type ProductVariantWithAttributes = Omit<ProductVariant, "attributes"> & {
  attributes: VariantAttributes | null;
};
