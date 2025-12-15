import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Book from '@/models/Book';
import User from '@/models/User';
import { shareFileWithUser } from '@/lib/drive';
import { verifyWebhook } from '@/lib/payos';

export async function POST(req) {
  try {
    const body = await req.json();

    const data = await verifyWebhook(body);

    if (!data) {
      return NextResponse.json(
        { error: 'Thiếu thông tin đơn hàng' },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findOne({ code: data.orderCode });

    if (!order) {
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    if (data.code !== '00' && data.code !== '02') {
      return NextResponse.json(
        { message: 'Không cần cập nhật đơn hàng' },
        { status: 200 }
      )
    } else if (data.code === '02') {
      order.status = 'canceled';
      await order.save();
      return NextResponse.json(
        { message: 'Đơn hàng đã bị hủy' },
        { status: 200 }
      );
    } else if (data.code === '00') {

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
    };

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
