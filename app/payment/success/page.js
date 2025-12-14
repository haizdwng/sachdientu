'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentSuccess() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderCode = urlParams.get('order');
    console.log('Payment success for order:', orderCode);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircleIcon className="mx-auto h-24 w-24 text-green-500 mb-6" />
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thanh toán thành công!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Đơn hàng của bạn đã được thanh toán thành công. Bạn có thể tải xuống sách ngay bây giờ.
            </p>

            <div className="space-y-4">
              <Link
                href="/dashboard/books"
                className="block w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Xem sách đã mua
              </Link>
              
              <Link
                href="/dashboard/orders"
                className="block w-full bg-white text-indigo-600 border-2 border-indigo-600 py-3 px-6 rounded-lg font-semibold hover:bg-indigo-50"
              >
                Xem đơn hàng
              </Link>
              
              <Link
                href="/books"
                className="block w-full text-gray-600 hover:text-gray-900"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}