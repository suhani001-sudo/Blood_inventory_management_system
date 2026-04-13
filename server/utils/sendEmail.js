import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"BloodLink" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Welcome to BloodLink - Your Account Has Been Created',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to BloodLink</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #FAFAFA;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin-bottom: 20px;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 16px;
              box-shadow: 0 4px 20px rgba(226, 27, 47, 0.1);
              border: 1px solid #FFE8EC;
            }
            .title {
              color: #E21B2F;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
              text-align: center;
            }
            .highlight {
              background-color: #FFE8EC;
              padding: 20px;
              border-radius: 12px;
              margin: 20px 0;
              border-left: 4px solid #E21B2F;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background-color: #E21B2F;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #C91A2C;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="cid:logo" alt="BloodLink Logo" class="logo">
            <h1 class="title">Welcome to BloodLink</h1>
          </div>
          
          <div class="content">
            <p>Dear <strong>${userName}</strong>,</p>
            
            <p>Thank you for registering with BloodLink! Your account has been successfully created and you are now part of our modern blood bank management system.</p>
            
            <div class="highlight">
              <h3>What's Next?</h3>
              <ul>
                <li>Log in to your dashboard to get started</li>
                <li>Explore role-specific features tailored for you</li>
                <li>Connect with hospitals and manage blood requests</li>
                <li>Track inventory in real-time</li>
              </ul>
            </div>
            
            <p>BloodLink is designed to streamline blood bank operations, making it easier for hospitals, admins, and users to collaborate and save lives.</p>
            
            <div style="text-align: center;">
              <a href="http://localhost:5173/login" class="button">Login to Your Dashboard</a>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
            
            <p>Together, we're making blood donation and management more efficient and accessible.</p>
            
            <p>Best regards,<br>The BloodLink Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 BloodLink. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      attachments: [{
        filename: 'logo.png',
        path: 'client/public/images/Untitled design.png',
        cid: 'logo'
      }]
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', userEmail);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export default { sendWelcomeEmail };
