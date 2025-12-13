'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentCancel() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderCode = urlParams.get('order');
    console.log('Payment cancelled for order:', orderCode);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <XCircleIcon className="mx-auto h-24 w-24 text-red-500 mb-6" />
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thanh toán đã bị hủy
            </h1>
            
            <p className="text-gray-600 mb-8">
              Bạn đã hủy thanh toán. Đơn hàng của bạn chưa được hoàn tất. Bạn có thể thử lại bất cứ lúc nào.
            </p>

            <div className="space-y-4">
              <Link
                href="/dashboard/orders"
                className="block w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Xem đơn hàng
              </Link>
              
              <Link
                href="/books"
                className="block w-full bg-white text-indigo-600 border-2 border-indigo-600 py-3 px-6 rounded-lg font-semibold hover:bg-indigo-50"
              >
                Tiếp tục mua sắm
              </Link>
              
              <Link
                href="/dashboard"
                className="block w-full text-gray-600 hover:text-gray-900"
              >
                Về Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}