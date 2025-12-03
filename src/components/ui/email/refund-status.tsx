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
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface RefundStatusEmailProps {
  orderNumber: string;
  customerName: string;
  amount: number;
  status: string; // 'REQUESTED' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED'
}

export const RefundStatusEmail = ({
  orderNumber,
  customerName,
  amount,
  status,
}: RefundStatusEmailProps) => {
  const isSuccess = status === "SUCCEEDED";
  const previewText = `Update on your refund for Order #${orderNumber}`;

  // Ensure the base URL is available
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
                Refund Status Update
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">Hello {customerName},</Text>
              <Text className="text-black text-[14px] leading-[24px]">
                The status of your refund for order <strong>#{orderNumber}</strong> has been updated
                to:
              </Text>

              <Section className="text-center my-4">
                <Text className="text-[18px] font-bold text-[#5E503F] bg-[#F2F4F3] py-2 px-4 rounded inline-block">
                  {status}
                </Text>
              </Section>

              {/* Conditional Logic for different statuses */}
              {isSuccess ? (
                <Text className="text-black text-[14px] leading-[24px]">
                  A total of <strong>${(amount / 100).toFixed(2)}</strong> has been sent back to
                  your original payment method. Please allow 5-10 business days for it to appear on
                  your statement.
                </Text>
              ) : status === "FAILED" ? (
                <Text className="text-black text-[14px] leading-[24px]">
                  Unfortunately, the refund process failed. Please contact our support team for
                  assistance.
                </Text>
              ) : (
                <Text className="text-black text-[14px] leading-[24px]">
                  We have received your request and it is currently being processed. We will notify
                  you once the funds have been released.
                </Text>
              )}
            </Section>

            <Hr className="border-[#eaeaea] my-[26px] mx-0" />

            <Section className="text-center">
              <Link
                className="text-[#5E503F] text-[14px] leading-[24px] underline"
                href={`${baseUrl}/account/orders/${orderNumber}`}
              >
                View Order Details
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

export default RefundStatusEmail;
