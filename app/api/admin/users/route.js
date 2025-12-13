import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAdmin } from '@/lib/middleware';

export async function GET(req) {
  try {
    const authResult = await requireAdmin(req);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const authResult = await requireAdmin(req);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin người dùng' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Xóa người dùng thành công',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}