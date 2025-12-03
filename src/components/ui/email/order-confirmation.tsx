import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  items,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) => {
  const previewText = `Your Mepra order #${orderNumber} has been confirmed.`;

  // Ensure the base URL is available, fallback to localhost if missing (useful for dev)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                MEPRA | THE LUXURY ART
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">Hello {customerName},</Text>
              <Text className="text-black text-[14px] leading-[24px]">
                Thank you for your order. We are getting your package ready for delivery.
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                <strong>Order Number:</strong> {orderNumber}
              </Text>
            </Section>

            <Section className="mt-[32px] mb-[32px]">
              <Text className="text-black text-[14px] font-bold mb-2">Order Summary</Text>
              {items.map((item, index) => (
                <Row key={index} className="border-b border-[#eaeaea] pb-2 mb-2">
                  <Column>
                    <Text className="text-[14px] m-0">{item.name}</Text>
                    <Text className="text-[12px] text-gray-500 m-0">Qty: {item.quantity}</Text>
                  </Column>
                  <Column align="right">
                    <Text className="text-[14px] m-0 font-medium">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              ))}
              <Hr className="border-[#eaeaea] my-[20px] mx-0" />
              <Row>
                <Column>
                  <Text className="text-[14px] font-bold m-0">Total</Text>
                </Column>
                <Column align="right">
                  <Text className="text-[18px] font-bold m-0">${(total / 100).toFixed(2)}</Text>
                </Column>
              </Row>
            </Section>

            <Section>
              <Text className="text-black text-[14px] font-bold mb-2">Shipping Address</Text>
              <Text className="text-black text-[14px] leading-[24px] m-0">
                {shippingAddress.street}
              </Text>
              <Text className="text-black text-[14px] leading-[24px] m-0">
                {shippingAddress.city}, {shippingAddress.zipCode}
              </Text>
              <Text className="text-black text-[14px] leading-[24px] m-0">
                {shippingAddress.country}
              </Text>
            </Section>

            <Hr className="border-[#eaeaea] my-[26px] mx-0" />

            <Section className="text-center">
              <Link
                className="text-[#5E503F] text-[14px] leading-[24px] underline"
                href={`${baseUrl}/account/orders/${orderNumber}`}
              >
                View your order online
              </Link>
            </Section>

            <Text className="text-[#666666] text-[12px] leading-[24px] text-center mt-4">
              Mepra S.p.A. | Since 1947
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderConfirmationEmail;
