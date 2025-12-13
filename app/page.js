'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books?sort=sold&order=desc');
      const data = await response.json();
      setBooks(data.books.slice(0, 6));
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">
                Khám phá thế giới tri thức
              </h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Hàng ngàn cuốn sách điện tử chất lượng cao đang chờ bạn khám phá. 
                Đọc mọi lúc, mọi nơi trên mọi thiết bị.
              </p>
              <Link
                href="/books"
                className="inline-flex items-center bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Khám phá ngay
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Sách bán chạy
            </h2>
            <Link
              href="/books"
              className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center"
            >
              Xem tất cả
              <ArrowRightIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có sách nào</p>
            </div>
          )}
        </div>

        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Thư viện đa dạng</h3>
                <p className="text-gray-600">
                  Hàng ngàn đầu sách từ nhiều thể loại khác nhau
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-semibold mb-2">Thanh toán dễ dàng</h3>
                <p className="text-gray-600">
                  Hỗ trợ nhiều hình thức thanh toán an toàn
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-2">Đọc mọi lúc mọi nơi</h3>
                <p className="text-gray-600">
                  Truy cập trên mọi thiết bị, bất kỳ lúc nào
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}