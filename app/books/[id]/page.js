'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import { StarIcon } from '@heroicons/react/24/solid';
import {
  StarIcon as StarOutlineIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';

export default function BookDetail({ params }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [bookId, setBookId] = useState(null);
  const router = useRouter();

  const fetchBook = useCallback(async () => {
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error('Không tìm thấy sách');
        router.push('/books');
        return;
      }

      setBook(data.book);
      if (data.book.rating.some(r => String(r.userId) === String(data.userId))) setUserRating(data.book.rating.find(r => String(r.userId) === String(data.userId)).stars);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải sách');
    } finally {
      setLoading(false);
    }
  }, [bookId, router]);

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setBookId(resolvedParams.id);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    if (bookId) fetchBook();
  }, [bookId, fetchBook]);

  const handleRating = async (stars) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.warning('Vui lòng đăng nhập để đánh giá');
      return;
    }

    try {
      const res = await fetch(`/api/books/${bookId}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stars }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Không thể đánh giá');
        return;
      }

      setUserRating(stars);
      toast.success('Đánh giá thành công');
      fetchBook();
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi đánh giá');
    }
  };

  const renderStars = (rating, interactive = false) => {
    const value = Number(rating);
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i + 1 <= value;
      return (
        <button
          key={i}
          disabled={!interactive}
          onClick={() => interactive && handleRating(i + 1)}
        >
          {filled ? (
            <StarIcon className="cursor-pointer h-6 w-6 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="cursor-pointer h-6 w-6 text-gray-300" />
          )}
        </button>
      );
    });
  };

  const averageRating =
    book?.rating?.length > 0
      ? (
          book.rating.reduce((sum, r) => sum + r.stars, 0) /
          book.rating.length
        ).toFixed(1)
      : 0;

  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.warning('Vui lòng đăng nhập để mua sách');
      router.push('/login');
      return;
    }

    setPurchasing(true);

    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book._id }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        toast.error(orderData.error);
        return;
      }

      const payRes = await fetch('/api/payos/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: orderData.order._id }),
      });

      const payData = await payRes.json();
      if (!payRes.ok) {
        toast.error(payData.error);
        return;
      }

      window.location.href = payData.checkoutUrl;
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi mua sách');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-16 w-16 border-b-2 border-indigo-600 rounded-full" />
        </div>
      </>
    );
  }

  if (!book) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8 grid md:grid-cols-2 gap-8">
            <img
              src={book.image || '/book-placeholder.png'}
              alt={book.title}
              className="rounded-lg object-cover"
            />

            <div>
              <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
              <p className="text-gray-600 mb-2">Tác giả: {book.author}</p>

              <div className="flex items-center mb-4">
                {renderStars(averageRating)}
                <span className="ml-2 text-gray-600">
                  ({averageRating}) · {book.rating.length} đánh giá
                </span>
              </div>

              <p className="mb-4 text-gray-700">{book.description}</p>

              <p className="text-4xl font-bold text-indigo-600 mb-6">
                {book.price.toLocaleString('vi-VN')}₫
              </p>

              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="cursor-pointer w-full bg-indigo-600 text-white py-3 rounded-lg flex justify-center items-center"
              >
                <ShoppingCartIcon className="h-6 w-6 mr-2" />
                Mua ngay
              </button>

              <div className="mt-8 border-t pt-6">
                <h3 className="font-semibold mb-2">Đánh giá sách</h3>
                <div className="flex">{renderStars(userRating, true)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
