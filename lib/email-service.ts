import nodemailer from "nodemailer"

// Email configuration - can be configured via environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
})

// Email templates
export const emailTemplates = {
  donationConfirmed: (donorName: string, amount: number, txHash: string) => ({
    subject: "🎉 Donation Confirmed - DonateChain",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0088FE, #00C49F); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">DonateChain</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Thank You, ${donorName}!</h2>
          <p style="color: #666; font-size: 16px;">Your donation has been confirmed and recorded on the blockchain.</p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #0088FE; margin-top: 0;">Donation Details</h3>
            <p><strong>Amount:</strong> ৳${amount.toLocaleString()}</p>
            <p><strong>Transaction Hash:</strong> <code style="background: #eee; padding: 2px 6px; border-radius: 4px;">${txHash.substring(0, 20)}...</code></p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p style="color: #666;">You can view your donation receipt by logging into your dashboard.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" style="display: inline-block; background: #0088FE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Dashboard</a>
        </div>
        <div style="background: #333; color: white; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 12px;">© 2024 DonateChain - Transparent Donations</p>
        </div>
      </div>
    `,
  }),

  volunteerAssigned: (volunteerName: string, donationType: string, location: string) => ({
    subject: "📦 New Pickup Assignment - DonateChain",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0088FE, #00C49F); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">DonateChain</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">New Pickup Assignment</h2>
          <p style="color: #666; font-size: 16px;">Hello ${volunteerName},</p>
          <p style="color: #666;">You have been assigned a new pickup task.</p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #0088FE; margin-top: 0;">Task Details</h3>
            <p><strong>Type:</strong> ${donationType}</p>
            <p><strong>Pickup Location:</strong> ${location}</p>
          </div>
          
          <p style="color: #666;">Please accept and complete the pickup at your earliest convenience.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" style="display: inline-block; background: #00C49F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Tasks</a>
        </div>
      </div>
    `,
  }),

  deliveryCompleted: (donorName: string, volunteerName: string, donationType: string) => ({
    subject: "✅ Delivery Completed - DonateChain",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0088FE, #00C49F); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">DonateChain</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Good News, ${donorName}!</h2>
          <p style="color: #666; font-size: 16px;">Your donation has been successfully delivered!</p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #00C49F; margin-top: 0;">Delivery Details</h3>
            <p><strong>Item:</strong> ${donationType}</p>
            <p><strong>Delivered By:</strong> ${volunteerName}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p style="color: #666;">Thank you for your generosity! Please rate your experience.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" style="display: inline-block; background: #0088FE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Rate Delivery</a>
        </div>
      </div>
    `,
  }),

  volunteerWelcome: (volunteerName: string) => ({
    subject: "🎉 Welcome to DonateChain - Volunteer",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0088FE, #00C49F); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">DonateChain</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Welcome, ${volunteerName}!</h2>
          <p style="color: #666; font-size: 16px;">Your volunteer application has been approved!</p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #0088FE; margin-top: 0;">What's Next?</h3>
            <ul style="color: #666;">
              <li>Complete your profile</li>
              <li>Enable location sharing for real-time tracking</li>
              <li>Accept pickup tasks from your dashboard</li>
              <li>Upload proof photos after delivery</li>
            </ul>
          </div>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" style="display: inline-block; background: #00C49F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Start Volunteering</a>
        </div>
      </div>
    `,
  }),
}

// Send email function
export async function sendEmail(
  to: string,
  template: ReturnType<typeof emailTemplates.donationConfirmed>
) {
  // Skip if SMTP not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("Email not configured, skipping:", template.subject)
    return { success: true, skipped: true }
  }

  try {
    const info = await transporter.sendMail({
      from: `"DonateChain" <${process.env.SMTP_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
    })
    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error }
  }
}

// Notification helper functions
export async function notifyDonationConfirmed(
  donorEmail: string,
  donorName: string,
  amount: number,
  txHash: string
) {
  return sendEmail(donorEmail, emailTemplates.donationConfirmed(donorName, amount, txHash))
}

export async function notifyVolunteerAssigned(
  volunteerEmail: string,
  volunteerName: string,
  donationType: string,
  location: string
) {
  return sendEmail(volunteerEmail, emailTemplates.volunteerAssigned(volunteerName, donationType, location))
}

export async function notifyDeliveryCompleted(
  donorEmail: string,
  donorName: string,
  volunteerName: string,
  donationType: string
) {
  return sendEmail(donorEmail, emailTemplates.deliveryCompleted(donorName, volunteerName, donationType))
}

export async function notifyVolunteerWelcome(
  volunteerEmail: string,
  volunteerName: string
) {
  return sendEmail(volunteerEmail, emailTemplates.volunteerWelcome(volunteerName))
}

