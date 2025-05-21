const resetEmailTemplate = (resetPasswordLink: string) => `
<div style="max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; font-family: Arial, sans-serif; background-color: #f9fafb;">
  <h2 style="text-align: center; color: #0f172a;">Password Reset Request</h2>
  <p style="font-size: 16px; color: #334155;">
    We received a request to reset your password. Click the button below to reset it:
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${resetPasswordLink}" style="padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
      Reset Password
    </a>
  </div>
  <p style="font-size: 14px; color: #64748b;">
    If you did not request a password reset, please ignore this email.
  </p>
  <p style="font-size: 14px; color: #64748b;">Thank you,<br>Health Care Team</p>
</div>

`;

export default resetEmailTemplate;
