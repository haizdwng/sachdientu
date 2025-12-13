import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token không hợp lệ' },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json(
        { error: 'Người dùng không tồn tại' },
        { status: 404 }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { message: 'Email đã được xác thực trước đó' },
        { status: 200 }
      );
    }

    user.verified = true;
    await user.save();

    return NextResponse.json({
      message: 'Xác thực email thành công',
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xác thực email' },
      { status: 500 }
    );
  }
}