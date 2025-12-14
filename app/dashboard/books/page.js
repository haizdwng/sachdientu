'use client';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import { BookOpenIcon } from '@heroicons/react/24/outline';

export default function MyBooks() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = useCallback(async (token) => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const completedOrders = data.orders.filter(o => o.status === 'completed');
        setOrders(completedOrders);
      } else {
        toast.error('Không thể tải danh sách sách');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      toast.error('Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    fetchOrders(token);
  }, [fetchOrders, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sách của tôi</h1>
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Quay lại Dashboard
            </Link>
          </div>
          {orders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {orders.map((order) => (
                <Link key={order._id} href={`/dashboard/books/${order._id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                    <div className="relative h-64 bg-gray-200">
                      {order.bookId?.image ? (
                        <img
                          src={order.bookId.image}
                          alt={order.bookId.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-6xl">📚</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Đã mua
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {order.bookId?.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{order.bookId?.author}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <BookOpenIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có sách nào
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa mua sách nào. Hãy khám phá và mua sách yêu thích của bạn!
              </p>
              <Link
                href="/books"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Khám phá sách
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}