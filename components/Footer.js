import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray-900">
              Sách Điện Tử
            </span>
            . All rights reserved.
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4 text-gray-500" />
              <a
                href="mailto:contact@sachdientu.dev"
                className="hover:text-gray-900"
              >
                contact@ebooksachdientu.vercel.app
              </a>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-gray-500" />
              <a
                href="tel:0326396827"
                className="hover:text-gray-900"
              >
                032 639 6827
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-gray-500" />
              <span>Trường Đại Học Vinh, Nghệ An</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}