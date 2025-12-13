'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import { BookOpenIcon, UsersIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    fetchStats(token);
  }, []);

  const fetchStats = async (token) => {
    try {
      const [booksRes, usersRes, ordersRes] = await Promise.all([
        fetch('/api/books', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (!booksRes.ok || !usersRes.ok || !ordersRes.ok) {
        toast.error('Bạn không có quyền truy cập trang này');
        router.push('/');
        return;
      }

      const booksData = await booksRes.json();
      const usersData = await usersRes.json();
      const ordersData = await ordersRes.json();

      setStats({
        totalBooks: booksData.books.length,
        totalUsers: usersData.users.length,
        totalOrders: ordersData.orders.length,
        pendingOrders: ordersData.orders.filter(o => o.status === 'pending').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Đã xảy ra lỗi');
    } finally {
      setLoading(false);
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Quản trị hệ thống</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <BookOpenIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Tổng sách</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <UsersIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Người dùng</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <ShoppingBagIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Tổng đơn</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <ShoppingBagIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Đơn chờ</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/books">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quản lý sách</h3>
                    <p className="text-gray-600">Thêm, sửa, xóa sách</p>
                  </div>
                  <BookOpenIcon className="h-12 w-12 text-indigo-600" />
                </div>
              </div>
            </Link>

            <Link href="/admin/users">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quản lý người dùng</h3>
                    <p className="text-gray-600">Xem và quản lý người dùng</p>
                  </div>
                  <UsersIcon className="h-12 w-12 text-green-600" />
                </div>
              </div>
            </Link>

            <Link href="/admin/orders">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quản lý đơn hàng</h3>
                    <p className="text-gray-600">Xem tất cả đơn hàng</p>
                  </div>
                  <ShoppingBagIcon className="h-12 w-12 text-purple-600" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}