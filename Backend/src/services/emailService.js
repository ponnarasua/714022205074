import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name = "User", purpose = "Email Verification") => {
  try {
    const transporter = createTransporter();

    const subject = purpose === "Password Reset" 
      ? "Reset Your Password - URL Shortener" 
      : "Verify Your Email - URL Shortener";

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"URL Shortener" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .otp-box {
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              border-radius: 10px;
              padding: 30px;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              margin: 10px 0;
            }
            .message {
              font-size: 16px;
              margin: 20px 0;
              color: #666;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              text-align: left;
              color: #856404;
              font-size: 14px;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔗 URL Shortener</h1>
              <p>${purpose}</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p class="message">
                ${purpose === "Password Reset" 
                  ? "You requested to reset your password. Please use the following OTP:" 
                  : "Thank you for signing up. Please use the following OTP to verify your email address:"}
              </p>
              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your verification code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; font-size: 14px; color: #666;">Valid for 10 minutes</p>
              </div>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                • Never share this OTP with anyone<br>
                • This OTP is valid for 10 minutes only<br>
                • If you didn't request this, please ignore this email
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} URL Shortener. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after successful verification
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"URL Shortener" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to URL Shortener! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
            }
            .content {
              padding: 40px 30px;
            }
            .feature-box {
              background: #f8f9fa;
              border-radius: 8px;
              padding: 20px;
              margin: 15px 0;
              border-left: 4px solid #667eea;
            }
            .feature-box h3 {
              margin: 0 0 10px 0;
              color: #667eea;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 25px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome Aboard!</h1>
              <p>Your account is now verified</p>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>
                Welcome to URL Shortener! We're excited to have you on board. 
                Your email has been successfully verified and your account is now active.
              </p>
              
              <div class="feature-box">
                <h3>⚡ Lightning Fast</h3>
                <p>Create shortened URLs in seconds with our optimized system.</p>
              </div>
              
              <div class="feature-box">
                <h3>🎯 Custom IDs</h3>
                <p>Personalize your short links with custom identifiers.</p>
              </div>
              
              <div class="feature-box">
                <h3>⏰ Expiration Control</h3>
                <p>Set custom expiration times for enhanced security.</p>
              </div>
              
              <div class="feature-box">
                <h3>📊 URL History</h3>
                <p>Track and manage all your shortened URLs in one place.</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p>Ready to get started?</p>
                <a href="${process.env.BASE_URL || 'http://localhost:5173'}" class="cta-button">
                  Start Shortening URLs
                </a>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} URL Shortener. All rights reserved.</p>
              <p>Need help? Contact us at support@urlshortener.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
};
