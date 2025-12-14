import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Book from '@/models/Book';

export async function POST(req, { params }) {
  await connectDB();

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    const { id } = await params;
    const { stars } = await req.json();

    if (!stars || stars < 1 || stars > 5) {
      return NextResponse.json(
        { error: 'Số sao không hợp lệ' },
        { status: 400 }
      );
    }

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json(
        { error: 'Không tìm thấy sách' },
        { status: 404 }
      );
    }

    if (!book.bought.includes(userId)) {
      return NextResponse.json(
        { error: 'Chỉ người đã mua sách mới có thể đánh giá' },
        { status: 403 }
      );
    }

    const existingRating = book.rating.find(
      (r) => r.userId.toString() === userId
    );

    if (existingRating) {
      existingRating.stars = stars;
      existingRating.updatedAt = new Date();
    } else {
      book.rating.push({
        userId,
        stars,
      });
    }

    await book.save();

    return NextResponse.json(
      { message: 'Đánh giá thành công' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Rating error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}
