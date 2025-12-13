import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { requireAuth } from '@/lib/middleware';

export async function GET(req, { params }) {
  try {
    const authResult = await requireAuth(req);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    await connectDB();

    const order = await Order.findById(id)
      .populate('bookId')
      .populate('userId', 'name email');

    if (!order) {
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    if (authResult.user.role !== 'admin' && 
        order.userId._id.toString() !== authResult.user._id.toString()) {
      return NextResponse.json(
        { error: 'Bạn không có quyền xem đơn hàng này' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const authResult = await requireAuth(req);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const { status } = await req.json();

    await connectDB();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    if (authResult.user.role !== 'admin' && 
        order.userId.toString() !== authResult.user._id.toString()) {
      return NextResponse.json(
        { error: 'Bạn không có quyền cập nhật đơn hàng này' },
        { status: 403 }
      );
    }

    order.status = status;
    await order.save();

    return NextResponse.json({
      message: 'Cập nhật đơn hàng thành công',
      order,
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}