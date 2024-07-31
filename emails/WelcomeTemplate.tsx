import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Img,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userFirstname: string;
  site: {
    name: string;
    logo: string;
    domainName: string;
    themeName: string;
  };
}

export const WelcomeEmail = ({ userFirstname, site }: WelcomeEmailProps) => (
  <Html data-theme={site.themeName}>
    <Head />
    <Preview>Welcome to {site.name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_2048/f_auto/q_auto/v1/${site.logo}?_a=BAVCluDW0`}
          width="100"
          height="100"
          alt={site.name}
          style={logo}
        />
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>Welcome to {site.name} Learning Platform.</Text>
        <Section style={btnContainer}>
          <Button style={button} href={site.domainName}>
            Get started
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);

WelcomeEmail.PreviewProps = {
  userFirstname: "Alan",
  site: {
    name: "Acme",
    logo: "courseCovers/z4o7fbpselehs3jmt1rg",
    domainName: "https://cubite.io",
    themeName: "lofi",
  },
} as WelcomeEmailProps;

export default WelcomeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
