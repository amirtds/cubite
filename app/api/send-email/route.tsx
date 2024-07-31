import { Resend } from "resend";
import WelcomeTemplate from "@/emails/WelcomeTemplate";
import EnrollmentTemplate from "@/emails/EnrollmentTemplate";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Check if the RESEND_API_KEY environment variable is set
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        status: 500,
        message: "Server configuration error: API key missing.",
      });
    }

    const body = await request.json();
    if (body.type === "welcome") {
      // Validate the input
      const { userFirstname, to, subject, site } = body;
      if (!userFirstname || !to || !subject || !site) {
        return NextResponse.json({
          status: 400,
          message: "Bad Request: 'name', 'to', and 'subject' are required.",
        });
      }

      // Send the email
      const emailResponse = await resend.emails.send({
        from: "devops@cubite.dev",
        to,
        subject,
        react: <WelcomeTemplate userFirstname={userFirstname} site={site} />,
      });
    } else if (body.type === "enrollment") {
      // Validate the input
      const { userFirstname, to, site, subject, course } = body;
      if (!userFirstname || !to || !subject || !site || !course) {
        return NextResponse.json({
          status: 400,
          message:
            "Bad Request: 'name', 'to', 'subject', 'site', and 'course' are required.",
        });
      }

      // Send the email
      const emailResponse = await resend.emails.send({
        from: "devops@cubite.dev",
        to,
        subject,
        react: (
          <EnrollmentTemplate
            userFirstname={userFirstname}
            course={course}
            site={site}
          />
        ),
      });
    }

    // Return success response
    return NextResponse.json({
      status: 200,
      message: "Email sent successfully.",
      emailResponse,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    // Return error response
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error: Unable to send email.",
      error: error.message,
    });
  }
}
