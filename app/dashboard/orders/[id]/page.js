'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function OrderDetail({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
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
        setOrder(data.order);
      } else {
        toast.error('Không tìm thấy đơn hàng');
        router.push('/dashboard/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      return;
    }

    setCancelling(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/payos/payment/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: order._id }),
      });

      if (response.ok) {
        toast.success('Hủy đơn hàng thành công');
        fetchOrder(token);
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error('Đã xảy ra lỗi');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-16 w-16 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-16 w-16 text-yellow-500" />;
      case 'cancelled':
      case 'failed':
        return <XCircleIcon className="h-16 w-16 text-red-500" />;
      default:
        return <ClockIcon className="h-16 w-16 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chờ thanh toán',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
      failed: 'Thất bại',
    };
    return labels[status] || status;
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
            <Link
              href="/dashboard/orders"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Quay lại
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-center mb-8">
                {getStatusIcon(order.status)}
              </div>
              
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                {getStatusLabel(order.status)}
              </h2>
              
              <p className="text-center text-gray-600 mb-8">
                Mã đơn hàng: {order.code}
              </p>

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Thông tin sách</h3>
                <div className="flex items-center">
                  <div className="w-24 h-32 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                    {order.bookId?.image ? (
                      <img
                        src={order.bookId.image}
                        alt={order.bookId.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        📚
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {order.bookId?.title}
                    </h4>
                    <p className="text-gray-600">{order.bookId?.author}</p>
                    <p className="text-indigo-600 font-semibold mt-2">
                      {order.amount.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-semibold">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-semibold">{getStatusLabel(order.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {order.amount.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {order.status === 'completed' && (
                <Link
                  href={`/dashboard/books/${order._id}`}
                  className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Xem sách
                </Link>
              )}

              {order.status === 'pending' && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}