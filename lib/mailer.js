import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.URL}/verify?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Xác thực email của bạn',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Xác thực email</h2>
        <p>Cảm ơn bạn đã đăng ký! Vui lòng nhấn vào nút bên dưới để xác thực email của bạn:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Xác thực Email</a>
        <p>Hoặc copy link sau vào trình duyệt:</p>
        <p>${verificationUrl}</p>
        <p>Link này sẽ hết hạn sau 24 giờ.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};