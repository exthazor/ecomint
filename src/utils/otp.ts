// otp.ts
import nodemailer from 'nodemailer';

export const generateOtp = (length: number = 8): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};
export const sendOtpEmail = async (to: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // HTML email template
  const emailTemplate = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          background-color: #ffffff;
          width: 100%;
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #007bff;
          color: white;
          padding: 10px;
          text-align: center;
        }
        .body-content {
          padding: 20px;
          text-align: center;
        }
        .otp {
          font-size: 24px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your One-Time Password</h1>
        </div>
        <div class="body-content">
          <p>Please use the following One-Time Password to complete your login:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
        <div class="footer">
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    </body>
  </html>
`;

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: to,
    subject: `Your OTP is ${otp}`,
    html: emailTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};
