import { NextResponse } from 'next/server';
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

    return NextResponse.json({
      user: authResult.user,
    });
  } catch (error) {
    console.error('Get me error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const authResult = await requireAuth(req);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { name } = await req.json();

    if (name) {
      authResult.user.name = name;
      await authResult.user.save();
    }

    return NextResponse.json({
      message: 'Cập nhật thông tin thành công',
      user: authResult.user,
    });
  } catch (error) {
    console.error('Update me error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}