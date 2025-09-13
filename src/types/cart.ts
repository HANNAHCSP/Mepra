import { Prisma } from "@prisma/client";

// This type defines a single cart item, including the nested variant and product.
// Prisma.CartItemGetPayload is a utility that creates a precise type based on the 'include' statement.
export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: {
    variant: {
      include: {
        product: true;
      };
    };
  };
}>;

// This type defines the complete cart object, including the array of fully-typed items.
export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        variant: {
          include: {
            product: true;
          };
        };
      };
    };
  };
}>;