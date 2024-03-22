import nodemailer from 'nodemailer';

export const generateOtp = (length = 8) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  };  

export const sendOtpEmail = async (to: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: to,
    subject: `Your OTP is ${otp}`,
    text: `Your OTP is: ${otp}`,
  };

  return transporter.sendMail(mailOptions);
};
