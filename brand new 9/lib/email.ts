import nodemailer from "nodemailer"

const smtpConfig = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "hanonymous371@gmail.com",
    pass: "dqhp wtwk flae shmv",
  },
}

const transporter = nodemailer.createTransport(smtpConfig)

export async function sendPasswordResetEmail(email: string, resetToken: string, baseUrl: string) {
  const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

  const mailOptions = {
    from: '"FormCraft" <hanonymous371@gmail.com>',
    to: email,
    subject: "Reset Your FormCraft Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8a2be2;">Reset Your FormCraft Password</h2>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #8a2be2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The FormCraft Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendFormSubmissionNotification(userEmail: string, formTitle: string) {
  const mailOptions = {
    from: '"FormCraft" <hanonymous371@gmail.com>',
    to: userEmail,
    subject: `New Submission: ${formTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8a2be2;">New Form Submission</h2>
        <p>You've received a new submission for your form: <strong>${formTitle}</strong></p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://formcraft.vercel.app/dashboard" style="background-color: #8a2be2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">View Responses</a>
        </div>
        <p>Best regards,<br>The FormCraft Team</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

