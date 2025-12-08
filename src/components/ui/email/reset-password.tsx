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
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  resetLink: string;
}

export const ResetPasswordEmail = ({ resetLink }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Mepra password</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Reset your Password
              </Heading>
              <Text className="text-black text-[14px] leading-[24px]">
                We received a request to reset the password for your Mepra account. If you
                didn&apos;t ask for this, you can safely ignore this email.
              </Text>
              <Section className="text-center mt-[32px] mb-[32px]">
                <Link
                  className="bg-[#5E503F] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href={resetLink}
                >
                  Reset Password
                </Link>
              </Section>
              <Text className="text-black text-[14px] leading-[24px]">
                Or copy and paste this URL into your browser:{" "}
                <Link href={resetLink} className="text-[#a9927d] underline">
                  {resetLink}
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;
