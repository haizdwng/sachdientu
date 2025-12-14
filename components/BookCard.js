'use client';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

export default function BookCard({ book }) {
  const averageRating =
    book.rating?.length > 0
      ? (
          book.rating.reduce((sum, r) => sum + r.stars, 0) /
          book.rating.length
        ).toFixed(1)
      : 0;

  const renderStars = (rating) => {
    const value = Number(rating);
    const fullStars = Math.floor(value);

    return Array.from({ length: 5 }, (_, i) =>
      i < fullStars ? (
        <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
      ) : (
        <StarOutlineIcon key={i} className="h-5 w-5 text-gray-300" />
      )
    );
  };

  return (
    <Link href={`/books/${book._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative h-64 bg-gray-200">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-6xl">📚</span>
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {book.title}
          </h3>

          <p className="text-sm text-gray-600 mb-2">{book.author}</p>

          {book.category && (
            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mb-2">
              {book.category}
            </span>
          )}

          <div className="flex items-center mb-2">
            {renderStars(averageRating)}
            <span className="ml-2 text-sm text-gray-600">
              ({averageRating})
            </span>
          </div>

          <div className="mt-auto flex justify-between items-center">
            <span className="text-2xl font-bold text-indigo-600">
              {book.price.toLocaleString('vi-VN')}₫
            </span>
            {book.sold > 0 && (
              <span className="text-sm text-gray-500">
                Đã bán: {book.sold}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
