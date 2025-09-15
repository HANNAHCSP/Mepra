// src/lib/schemas.ts
import { z } from 'zod';

// Define the schema for the shipping address
export const ShippingAddressSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  address: z.string().min(1, "Address is required."),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required."),
  country: z.string().min(1, "Country is required."),
  zipCode: z.string().min(1, "ZIP code is required."),
  phone: z.string().optional(),
});

// Define the type for the form state
export type ShippingAddressFormState = {
  message: string;
  errors?: {
    [key in keyof z.infer<typeof ShippingAddressSchema>]?: string[];
  };
  success: boolean;
};