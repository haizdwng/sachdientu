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

export const sendOrderInformation = async (email, orderDetails) => {
  const { orderCode, items, totalAmount, orderDate } = orderDetails;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.price.toLocaleString()} VND</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Thông tin đơn hàng của bạn',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Thông tin đơn hàng</h2>
        <p>Cảm ơn bạn đã mua hàng! Dưới đây là thông tin đơn hàng của bạn:</p>
        <p><strong>Mã đơn hàng:</strong> ${orderCode}</p>
        <p><strong>Ngày đặt hàng:</strong> ${new Date(orderDate).toLocaleDateString()}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Sản phẩm</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>Tổng cộng</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>${totalAmount.toLocaleString()} VND</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Order email sending failed:', error);
    return { success: false, error: error.message };
  }
};

export const sendOrderCancellation = async (email, orderCode) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Đơn hàng của bạn đã bị hủy',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Đơn hàng bị hủy</h2>
        <p>Đơn hàng với mã <strong>${orderCode}</strong> của bạn đã bị hủy thành công.</p>
        <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Cancellation email sending failed:', error);
    return { success: false, error: error.message };
  }
};