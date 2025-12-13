import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Sách Điện Tử',
  description: 'Cửa hàng sách điện tử',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${inter.className}`}>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}