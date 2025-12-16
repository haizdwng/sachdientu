import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book from '@/models/Book';
import Order from '@/models/Order';
import { requireAuth } from '@/lib/middleware';
import { downloadFile } from '@/lib/drive';

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

    const order = await Order.findOne({
      userId: authResult.user._id,
      bookId: id,
      status: 'completed',
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Bạn phải mua sách trước khi tải xuống' },
        { status: 403 }
      );
    }

    if (!book.id) {
      return NextResponse.json(
        { error: 'File ID không hợp lệ' },
        { status: 400 }
      );
    }

    if (!book) {
      return NextResponse.json(
        { error: 'Không tìm thấy sách' },
        { status: 404 }
      );
    }

    if (!book.bought.includes(authResult.user._id)) {
      return NextResponse.json(
        { error: 'Chỉ người đã mua sách mới có thể tải về' },
        { status: 403 }
      );
    }

    const file = await downloadFile(book.id);
    if (!file) {
      return NextResponse.json(
        { error: 'Không thể tải tệp từ Google Drive' },
        { status: 500 }
      );
    }

    const headers = new Headers();
    headers.set(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(book.title)}.pdf"`
    );
    headers.set('Content-Type', 'application/pdf');

    return new NextResponse(file.data, { headers });

  } catch (err) {
    console.error('Tải xuống lỗi:', err);
    return NextResponse.json(
      { error: 'Tải xuống thất bại' },
      { status: 500 }
    );
  }
}