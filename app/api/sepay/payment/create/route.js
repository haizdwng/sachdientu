import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { requireAuth } from '@/lib/middleware';
import { createPayment } from '@/lib/sepay';

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

    const order = await Order.findById(orderId).populate('bookId');

    if (!order) {
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    if (order.userId.toString() !== authResult.user._id.toString()) {
      return NextResponse.json(
        { error: 'Bạn không có quyền thanh toán đơn hàng này' },
        { status: 403 }
      );
    }

    if (order.status === 'completed') {
      return NextResponse.json(
        { error: 'Đơn hàng đã được thanh toán' },
        { status: 400 }
      );
    }

    const paymentData = {
      code: order.code,
      amount: order.amount,
      description: `Mua sách ${order.bookId.title} [#${order.code}]`,
      customerId: authResult.user._id.toString(),
    };

    const { fields, checkoutUrl } = createPayment(paymentData);

    return NextResponse.json({
      fields,
      checkoutUrl,
    });
  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tạo thanh toán' },
      { status: 500 }
    );
  }
}