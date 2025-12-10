// src/lib/zod-schemas.ts
import { z } from 'zod';
import { GOVERNORATES } from '@/lib/shipping-rates';

// Define the schema for the shipping address
export const ShippingAddressSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  address: z.string().min(1, "Address is required."),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required."),
  
  // FIX: 
  // 1. Cast GOVERNORATES to [string, ...string[]] to satisfy Zod's tuple requirement.
  // 2. Use 'message' instead of 'errorMap' for the custom error object.
  state: z.enum(GOVERNORATES as unknown as [string, ...string[]], {
    message: "Please select a valid Governorate.",
  }),

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