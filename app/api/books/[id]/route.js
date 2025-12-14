import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book from '@/models/Book';
import { requireAdmin, requireAuth } from '@/lib/middleware';

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

    const book = await Book.findById(id);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Không tìm thấy sách' },
        { status: 404 }
      );
    }

    return NextResponse.json({ book, userId: authResult.user._id });
  } catch (error) {
    console.error('Get book error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const authResult = await requireAdmin(req);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const updateData = await req.json();

    await connectDB();

    const book = await Book.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );

    if (!book) {
      return NextResponse.json(
        { error: 'Không tìm thấy sách' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Cập nhật sách thành công',
      book,
    });
  } catch (error) {
    console.error('Update book error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const authResult = await requireAdmin(req);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;

    await connectDB();

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return NextResponse.json(
        { error: 'Không tìm thấy sách' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Xóa sách thành công',
    });
  } catch (error) {
    console.error('Delete book error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}