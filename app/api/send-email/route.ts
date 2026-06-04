import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, message, attachmentUrl } = body;

    // Validation
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, message" },
        { status: 400 }
      );
    }

    // TODO: Implement actual email sending with Resend
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'PROUV <noreply@prouv.com>',
    //   to: to,
    //   subject: subject,
    //   html: message,
    //   attachments: attachmentUrl ? [{ filename: 'certificate.pdf', path: attachmentUrl }] : []
    // });

    // For now, return success (mock)
    console.log("Email would be sent to:", to);
    console.log("Subject:", subject);
    console.log("Message:", message);

    return NextResponse.json(
      { 
        success: true, 
        message: "Email envoyé avec succès (mock - intégration Resend à configurer)" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
