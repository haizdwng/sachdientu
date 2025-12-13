import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Book from '@/models/Book';
import User from '@/models/User';
import { shareFileWithUser } from '@/lib/drive';

export async function POST(req) {
  try {
    const secretKey = process.env.SEPAY_SECRET_KEY;
    const requestSecret = req.headers.get('X-Secret-Key');

    if (!secretKey || requestSecret !== secretKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();

    if (!data.order) {
      return NextResponse.json(
        { error: 'Thiếu thông tin đơn hàng' },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findOne({ code: data.order.invoice_order_number });

    if (!order) {
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    if (
      data.notification_type !== 'ORDER_PAID' ||
      data.order.order.order_status !== 'CAPTURED'
    ) return NextResponse.json(
      { message: 'Không cần cập nhật đơn hàng' },
      { status: 200 }
    );

    order.status = 'completed';
    await order.save();

    const book = await Book.findById(order.bookId);
    if (book) {
      if (!book.bought.includes(order.userId)) {
        book.bought.push(order.userId);
      }
      book.sold = (book.sold || 0) + 1;
      await book.save();
    }

    const user = await User.findById(order.userId);

    await shareFileWithUser(book.id, user.email);

    return NextResponse.json({
      message: 'Cập nhật đơn hàng thành công',
    }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}