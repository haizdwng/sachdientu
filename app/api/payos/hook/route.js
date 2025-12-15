import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Book from '@/models/Book';
import User from '@/models/User';
import { shareFileWithUser } from '@/lib/drive';
import { verifyWebhook } from '@/lib/payos';

export async function POST(req) {
  try {
    const body = await req.json();

    const data = await verifyWebhook(body);

    if (!data) {
      return NextResponse.json(
        { error: 'Thiếu thông tin đơn hàng' },
        { status: 400 }
      );
    }

    

    return NextResponse.json({
      message: 'Cập nhật đơn hàng thành công',
    }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}
