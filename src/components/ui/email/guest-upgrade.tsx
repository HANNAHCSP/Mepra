import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface GuestUpgradeEmailProps {
  upgradeLink: string;
  orderNumber: string;
}

export const GuestUpgradeEmail = ({ upgradeLink, orderNumber }: GuestUpgradeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Save your order #{orderNumber}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Create Your Account
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">
                Thank you for your recent order <strong>#{orderNumber}</strong>.
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                You checked out as a guest, but you can easily convert your guest history into a
                full account to track your order and save your details for next time.
              </Text>

              <Section className="text-center mt-[32px] mb-[32px]">
                <Link
                  className="bg-[#5E503F] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href={upgradeLink}
                >
                  Create Account
                </Link>
              </Section>

              <Hr className="border-[#eaeaea] my-[26px] mx-0" />

              <Text className="text-[#666666] text-[12px] leading-[24px]">
                This link will expire in 24 hours. If you did not place an order with Mepra, please
                ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default GuestUpgradeEmail;
