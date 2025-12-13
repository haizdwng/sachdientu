import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Book from '@/models/Book';
import { requireAuth } from '@/lib/middleware';

export async function GET(req) {
  try {
    const authResult = await requireAuth(req);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    let query = {};
    
    if (authResult.user.role !== 'admin') {
      query.userId = authResult.user._id;
    }

    const orders = await Order.find(query)
      .populate('bookId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const authResult = await requireAuth(req);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { bookId } = await req.json();

    if (!bookId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin sách' },
        { status: 400 }
      );
    }

    await connectDB();

    const book = await Book.findById(bookId);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Không tìm thấy sách' },
        { status: 404 }
      );
    }

    const existingOrder = await Order.findOne({
      userId: authResult.user._id,
      bookId: bookId,
      status: 'completed',
    });

    if (existingOrder) {
      return NextResponse.json(
        { error: 'Bạn đã mua sách này rồi' },
        { status: 400 }
      );
    }

    const orderCode = Number(String(Date.now()).slice(-6));

    const order = await Order.create({
      userId: authResult.user._id,
      bookId: bookId,
      code: orderCode,
      amount: book.price,
      status: 'pending',
    });

    return NextResponse.json(
      { message: 'Tạo đơn hàng thành công', order },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}