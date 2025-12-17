interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface SendEmailInput {
  user: User;
  otp: string;
}

const EMAIL_API_URL =
  "https://email-composer-phi.vercel.app/api/budget/mail";

export const sendEmail = async ({
  user,
  otp,
}: SendEmailInput): Promise<void> => {
  const fullName = `${user.firstName} ${user.lastName}`;

  const subject = "Your Password Reset OTP";

  const body = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset OTP</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f1fa; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; margin-top:40px; border-radius:8px; overflow:hidden;">
            <tr>
              <td style="background:#6a0dad; padding:20px; text-align:center; color:#ffffff;">
                <h2 style="margin:0;">Budget Tracker</h2>
              </td>
            </tr>
            <tr>
              <td style="padding:30px; color:#333;">
                <p style="font-size:16px;">Hello <strong>${fullName}</strong>,</p>
                <p style="font-size:15px;">
                  You requested to reset your password. Use the OTP below to continue:
                </p>

                <div style="text-align:center; margin:30px 0;">
                  <span style="
                    display:inline-block;
                    background:#f4f1fa;
                    color:#6a0dad;
                    font-size:28px;
                    letter-spacing:6px;
                    padding:15px 25px;
                    border-radius:6px;
                    font-weight:bold;
                  ">
                    ${otp}
                  </span>
                </div>

                <p style="font-size:14px; color:#555;">
                  This OTP is valid for <strong>15 minutes</strong>.
                  If you did not request a password reset, please ignore this email.
                </p>

                <p style="font-size:14px; margin-top:30px;">
                  Regards,<br />
                  <strong>Budget Tracker Team</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#f4f1fa; text-align:center; padding:15px; font-size:12px; color:#777;">
                © ${new Date().getFullYear()} Budget Tracker. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  const res = await fetch(EMAIL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: user.email,
      subject,
      body,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Email API failed: ${error}`);
  }
};