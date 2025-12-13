'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import { ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function BookDetail({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setOrderId(resolvedParams.id);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (orderId) {
      fetchOrder(token);
    }
  }, [orderId]);

  const fetchOrder = async (token) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.order.status !== 'completed') {
          toast.error('Bạn chưa mua sách này');
          router.push('/dashboard/books');
          return;
        }
        
        setOrder(data.order);
      } else {
        toast.error('Không tìm thấy đơn hàng');
        router.push('/dashboard/books');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (order?.bookId?.url) {
      window.open(order.bookId.url, '_blank');
      toast.success('Đang tải xuống...');
    } else {
      toast.error('Link tải không khả dụng');
    }
  };

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

  if (!order) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Chi tiết sách</h1>
            <Link
              href="/dashboard/books"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Quay lại
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div>
                <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-lg overflow-hidden">
                  {order.bookId?.image ? (
                    <img
                      src={order.bookId.image}
                      alt={order.bookId.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-9xl">📚</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {order.bookId?.title}
                </h2>
                
                <p className="text-xl text-gray-600 mb-4">
                  Tác giả: {order.bookId?.author}
                </p>
                
                {order.bookId?.category && (
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm mb-4">
                    {order.bookId.category}
                  </span>
                )}

                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {order.bookId?.description}
                  </p>
                </div>

                {order.bookId?.pages && (
                  <p className="text-gray-600 mb-4">
                    Số trang: {order.bookId.pages}
                  </p>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-semibold">
                    ✓ Bạn đã mua sách này
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Ngày mua: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleDownload}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center"
                  >
                    <ArrowDownTrayIcon className="h-6 w-6 mr-2" />
                    Tải xuống
                  </button>

                  {order.bookId?.url && (
                    <a
                      href={order.bookId.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
                    >
                      <EyeIcon className="h-6 w-6 mr-2" />
                      Đọc online
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}