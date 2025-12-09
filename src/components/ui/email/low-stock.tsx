import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface LowStockEmailProps {
  productName: string;
  sku: string;
  remainingStock: number;
  productId: string;
}

export const LowStockEmail = ({
  productName,
  sku,
  remainingStock,
  productId,
}: LowStockEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>Low Stock Alert: {productName}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-amber-600 text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              ⚠️ Low Stock Warning
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              The following item has reached a low stock level:
            </Text>

            <Section className="bg-gray-50 p-4 rounded-lg my-4">
              <Text className="m-0 font-bold text-lg">{productName}</Text>
              <Text className="m-0 text-sm text-gray-500">SKU: {sku}</Text>
              <Text className="m-0 text-amber-600 font-bold mt-2">
                Remaining Stock: {remainingStock}
              </Text>
            </Section>

            <Section className="text-center">
              <Link
                className="bg-[#5E503F] text-white text-[14px] font-semibold no-underline text-center px-6 py-3 rounded inline-block"
                href={`${baseUrl}/admin/products/${productId}`}
              >
                Manage Product
              </Link>
            </Section>

            <Hr className="border-[#eaeaea] my-[26px] mx-0" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">Mepra Admin System</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default LowStockEmail;
