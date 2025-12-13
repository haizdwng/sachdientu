import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateVerificationToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: false,
    });

    const verificationToken = generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { 
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
        userId: user._id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đăng ký' },
      { status: 500 }
    );
  }
}