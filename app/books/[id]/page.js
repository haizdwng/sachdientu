'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function BookDetail({ params }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [bookId, setBookId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setBookId(resolvedParams.id);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${bookId}`);
      const data = await response.json();
      
      if (response.ok) {
        setBook(data.book);
      } else {
        toast.error('Không tìm thấy sách');
        router.push('/books');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.warning('Vui lòng đăng nhập để mua sách');
      router.push('/login');
      return;
    }

    setPurchasing(true);

    try {
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book._id }),
      });

      const orderData = await orderResponse.json();

      if (orderResponse.ok) {
        const paymentResponse = await fetch('/api/sepay/payment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId: orderData.order._id }),
        });

        const paymentData = await paymentResponse.json();

        if (paymentResponse.ok) {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = paymentData.checkoutUrl;

          Object.keys(paymentData.fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentData.fields[key];
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        } else {
          toast.error(paymentData.error);
        }
      } else {
        toast.error(orderData.error);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Đã xảy ra lỗi khi mua sách');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRating = async (rating) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.warning('Vui lòng đăng nhập để đánh giá');
      return;
    }

    setUserRating(rating);
    toast.success('Đánh giá thành công!');
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      const filled = i <= rating;
      stars.push(
        <button
          key={i}
          onClick={() => interactive && handleRating(i)}
          disabled={!interactive}
          className={interactive ? 'cursor-pointer' : ''}
        >
          {filled ? (
            <StarIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="h-6 w-6 text-gray-300" />
          )}
        </button>
      );
    }
    
    return stars;
  };

  const averageRating = book?.rating?.length > 0
    ? (book.rating.reduce((a, b) => a + b, 0) / book.rating.length).toFixed(1)
    : 0;

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

  if (!book) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div>
                <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-lg overflow-hidden">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
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
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h1>
                
                <p className="text-xl text-gray-600 mb-4">Tác giả: {book.author}</p>
                
                {book.category && (
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm mb-4">
                    {book.category}
                  </span>
                )}

                <div className="flex items-center mb-6">
                  {renderStars(averageRating)}
                  <span className="ml-2 text-lg text-gray-600">
                    ({averageRating}) - {book.rating?.length || 0} đánh giá
                  </span>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>

                {book.pages && (
                  <p className="text-gray-600 mb-4">Số trang: {book.pages}</p>
                )}

                <div className="mb-6">
                  <span className="text-4xl font-bold text-indigo-600">
                    {book.price.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                {book.sold > 0 && (
                  <p className="text-gray-600 mb-6">Đã bán: {book.sold} cuốn</p>
                )}

                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {purchasing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="h-6 w-6 mr-2" />
                      Mua ngay
                    </>
                  )}
                </button>

                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Đánh giá sách này</h3>
                  <div className="flex items-center">
                    {renderStars(userRating, true)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}