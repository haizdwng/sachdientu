import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Book from '@/models/Book';
import { requireAdmin } from '@/lib/middleware';

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const sort = url.searchParams.get('sort') || 'createdAt';
    const order = url.searchParams.get('order') || 'desc';

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const sortOption = {};
    sortOption[sort] = order === 'asc' ? 1 : -1;

    const books = await Book.find(query).sort(sortOption);

    return NextResponse.json({ books });
  } catch (error) {
    console.error('Get books error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi lấy danh sách sách' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const authResult = await requireAdmin(req);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const bookData = await req.json();

    if (!bookData.id || !bookData.title || !bookData.price) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    await connectDB();

    const book = await Book.create(bookData);

    return NextResponse.json(
      { message: 'Thêm sách thành công', book },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create book error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi thêm sách' },
      { status: 500 }
    );
  }
}