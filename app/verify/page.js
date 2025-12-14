'use client';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function Verify() {
  const [status, setStatus] = useState('loading');
  const router = useRouter();

  const verifyEmail = useCallback(async (token) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        toast.success(data.message);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus('error');
        toast.error(data.error);
      }
    } catch (error) {
      setStatus('error');
      toast.error('Đã xảy ra lỗi khi xác thực email');
    }
  }, [router]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    queueMicrotask(() => {
      if (!token) {
        setStatus('error');
        toast.error('Token không hợp lệ');
        return;
      }

      verifyEmail(token);
    });
  }, [verifyEmail]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {status === 'loading' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                <h2 className="mt-6 text-xl font-semibold text-gray-900">
                  Đang xác thực email...
                </h2>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center">
                <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  Xác thực thành công!
                </h2>
                <p className="mt-2 text-gray-600">
                  Email của bạn đã được xác thực. Đang chuyển hướng đến trang đăng nhập...
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  Xác thực thất bại
                </h2>
                <p className="mt-2 text-gray-600">
                  Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng ký lại.
                </p>
                <Link
                  href="/register"
                  className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                >
                  Đăng ký lại
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}