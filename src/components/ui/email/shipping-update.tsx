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

interface ShippingUpdateEmailProps {
  orderNumber: string;
  customerName: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
}

export const ShippingUpdateEmail = ({
  orderNumber,
  customerName,
  carrier,
  trackingNumber,
  trackingUrl = "#",
}: ShippingUpdateEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your order #{orderNumber} has shipped!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Good News!
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">Hello {customerName},</Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Your order <strong>#{orderNumber}</strong> has been handed over to{" "}
              <strong>{carrier}</strong> and is on its way to you.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <div className="bg-gray-50 border border-gray-200 rounded p-4 inline-block text-left">
                <Text className="m-0 text-xs text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </Text>
                <Text className="m-0 text-lg font-mono font-medium text-black">
                  {trackingNumber}
                </Text>
              </div>
            </Section>

            {trackingUrl && (
              <Section className="text-center">
                <Link
                  className="bg-[#5E503F] text-white text-[14px] font-semibold no-underline text-center px-6 py-3 rounded"
                  href={trackingUrl}
                >
                  Track Package
                </Link>
              </Section>
            )}

            <Hr className="border-[#eaeaea] my-[26px] mx-0" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Please allow up to 24 hours for the tracking link to update.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ShippingUpdateEmail;
