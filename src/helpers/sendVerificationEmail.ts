import { resend } from "@/lib/resend";
import { render } from '@react-email/render';
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));
    
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: 'Mystery Message Verification Code',
      html: emailHtml,
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}