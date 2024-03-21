import nodemailer from 'nodemailer';

export const generateOtp = (length = 6) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  };  

export const sendOtpEmail = async (to: string, otp: string) => {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: to, // List of receivers
    subject: `Your OTP is ${otp}`,
    text: `Your OTP is: ${otp}`,
  };

  // Send mail with defined transport object
  return transporter.sendMail(mailOptions);
};
