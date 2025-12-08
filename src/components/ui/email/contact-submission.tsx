import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface ContactSubmissionEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactSubmissionEmail = ({
  name,
  email,
  subject,
  message,
}: ContactSubmissionEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Message: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Customer Inquiry</Heading>

          <Section style={section}>
            <Text style={label}>Customer Name</Text>
            <Text style={text}>{name}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Customer Email</Text>
            <Link href={`mailto:${email}`} style={link}>
              {email}
            </Link>
          </Section>

          <Section style={section}>
            <Text style={label}>Subject</Text>
            <Text style={text}>{subject}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={label}>Message</Text>
            <Text style={messageBox}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>You can reply directly to this email to contact the customer.</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactSubmissionEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  maxWidth: "520px",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "0 0 30px",
};

const section = {
  marginBottom: "20px",
};

const label = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  marginBottom: "8px",
};

const text = {
  color: "#111827",
  fontSize: "16px",
  margin: "0",
  lineHeight: "24px",
};

const link = {
  color: "#5E503F",
  fontSize: "16px",
  textDecoration: "underline",
};

const messageBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "16px",
  color: "#111827",
  fontSize: "15px",
  lineHeight: "24px",
  whiteSpace: "pre-wrap" as const,
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "12px",
};
