// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if environment variables are available
    const gmailUser = process.env.GMAIL_USER
    const gmailPassword = process.env.GMAIL_APP_PASSWORD

    if (!gmailUser || !gmailPassword) {
      console.error('Missing Gmail credentials in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create transporter using Gmail with environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    })

    // Verify the transporter configuration
    try {
      await transporter.verify()
    } catch (verifyError) {
      console.error('Gmail transporter verification failed:', verifyError)
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      )
    }

    // Email content for the subscriber
    const subscriberEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to BTAML UNIVERSE Newsletter</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0F4007, #1a6b0f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .logo { width: 60px; height: 60px; background: white; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
            .button { display: inline-block; background: #1a6b0f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🌍</div>
              <h1>Welcome to BTAML UNIVERSE</h1>
              <p>Your trusted source for reliable news and insightful analysis</p>
            </div>
            <div class="content">
              <h2>Thank you for subscribing!</h2>
              <p>We're excited to have you join our community of informed readers. You'll now receive:</p>
              <ul>
                <li>Strategic business analysis and insights</li>
                <li>Research and data-driven reports</li>
                <li>Regional intelligence and monitoring</li>
                <li>Exclusive opportunities and updates</li>
                <li>Security and intelligence briefings</li>
              </ul>
              <p>Our newsletter is delivered weekly, bringing you the most relevant and timely information to keep you ahead of the curve.</p>
              <a href="https://www.btamluniverse.com" class="button">Visit Our Website</a>
              <p>If you have any questions or need assistance, feel free to contact us at ${gmailUser}</p>
            </div>
            <div class="footer">
              <p>© 2025 BTAML UNIVERSE. All rights reserved.</p>
              <p>You received this email because you subscribed to our newsletter.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Email content for admin notification
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Newsletter Subscription</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0F4007, #1a6b0f); color: white; padding: 20px; text-align: center; border-radius: 6px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 6px; margin-top: 20px; }
            .email-info { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #1a6b0f; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Newsletter Subscription</h1>
            </div>
            <div class="content">
              <h2>Subscription Details</h2>
              <div class="email-info">
                <strong>Email:</strong> ${email}<br>
                <strong>Date:</strong> ${new Date().toLocaleString()}<br>
                <strong>Source:</strong> Website Newsletter Form
              </div>
              <p>A new user has subscribed to the BTAML UNIVERSE newsletter. Please add this email to your mailing list if not done automatically.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send welcome email to subscriber
    await transporter.sendMail({
      from: `"BTAML UNIVERSE" <${gmailUser}>`,
      to: email,
      subject: 'Welcome to BTAML UNIVERSE Newsletter!',
      html: subscriberEmailHtml,
    })

    // Send notification to admin
    await transporter.sendMail({
      from: `"BTAML UNIVERSE" <${gmailUser}>`,
      to: gmailUser,
      subject: 'New Newsletter Subscription',
      html: adminEmailHtml,
    })

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}