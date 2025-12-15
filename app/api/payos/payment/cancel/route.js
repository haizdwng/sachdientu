import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { requireAuth } from '@/lib/middleware';
import { cancelPayment } from '@/lib/payos';
import { sendOrderCancellation } from '@/lib/mailer';

export async function POST(req) {
  try {
    const authResult = await requireAuth(req);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin đơn hàng' },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    if (order.userId.toString() !== authResult.user._id.toString()) {
      return NextResponse.json(
        { error: 'Bạn không có quyền hủy đơn hàng này' },
        { status: 403 }
      );
    }

    if (order.status === 'completed') {
      return NextResponse.json(
        { error: 'Không thể hủy đơn hàng đã thanh toán' },
        { status: 400 }
      );
    }

    const result = await cancelPayment(order.code);

    order.status = 'cancelled';
    await order.save();

    await sendOrderCancellation(authResult.user.email, order.code);

    return NextResponse.json({
      message: 'Hủy đơn hàng thành công',
      order,
    });
  } catch (error) {
    console.error('Cancel payment error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi hủy thanh toán' },
      { status: 500 }
    );
  }
}