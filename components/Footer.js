'use client';

import Link from 'next/link';
import { SparklesIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Khám phá sách', href: '/books' },
    { name: 'Đăng nhập', href: '/login' },
    { name: 'Đăng ký', href: '/register' },
  ];

  const support = [
    { name: 'Trợ giúp', href: '#' },
    { name: 'Chính sách', href: '#' },
    { name: 'Điều khoản', href: '#' },
    { name: 'Liên hệ', href: '#' },
  ];

  const categories = [
    { name: 'Văn học', href: '/books?category=Văn học' },
    { name: 'Kinh tế', href: '/books?category=Kinh tế' },
    { name: 'Kỹ năng sống', href: '/books?category=Kỹ năng sống' },
    { name: 'Công nghệ', href: '/books?category=Công nghệ' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Sách Điện Tử
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed mb-6">
              Nền tảng sách điện tử hàng đầu Việt Nam. Khám phá tri thức không giới hạn cùng hàng ngàn đầu sách chất lượng.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <span className="text-xl">💬</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <span className="text-xl">📧</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
                <span className="text-xl">📱</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="mr-2 text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Danh mục
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link 
                    href={category.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="mr-2 text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-300">
                <MapPinIcon className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                <span>Nhóm 2 - Nhập Môn CNTT, 182 Lê Duẩn, Thành Phố Vinh</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <PhoneIcon className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span>032 639 6827</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <EnvelopeIcon className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span>contact@sachdientu.dev</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-purple-300">Nhận bản tin</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2 rounded-l-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-r-xl font-semibold hover:shadow-lg transition-all">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <h4 className="text-center text-sm font-semibold mb-4 text-gray-300">Phương thức thanh toán</h4>
          <div className="flex justify-center items-center space-x-6 flex-wrap gap-4">
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="text-2xl">💳</span>
              <span className="ml-2 text-sm">Thẻ nội địa</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="text-2xl">🏦</span>
              <span className="ml-2 text-sm">Chuyển khoản</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm border border-white/20">
              <span className="text-2xl">📱</span>
              <span className="ml-2 text-sm">Ví điện tử</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} Sách Điện Tử. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            {support.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            Được phát triển bởi Nhóm Sách Điện Tử
          </p>
        </div>
      </div>
    </footer>
  );
}