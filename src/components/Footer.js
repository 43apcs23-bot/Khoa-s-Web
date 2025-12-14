import React from "react";

const Footer = () => {
  return (
    <div className="mx-auto container py-12 xl:px-6 lg:px-6 sm:px-6 px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 md:gap-8 gap-4">
        
        {/* Logo + Copyright */}
        <div className="flex flex-col">
          <div className="font-medium text-lg">
            <span className="text-rose-500 text-2xl">Shoe</span> store
          </div>

          <p className="text-sm text-gray-800 mt-4">
            Copyright © {new Date().getFullYear()} Shoe Store.
          </p>
          <p className="text-sm text-gray-800 mt-2">
            Đã đăng ký bản quyền
          </p>

          {/* Social icons (PLACEHOLDER) */}
          <div className="flex items-center gap-x-4 mt-6">
            {SOCIAL_ICONS.map(({ bg, icon, label }) => (
              <button
                key={label}
                type="button"
                title="Chức năng đang phát triển"
                aria-label={label}
                className={`opacity-40 w-8 h-8 rounded-full flex items-center justify-center cursor-not-allowed ${bg}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Công ty */}
        <div className="hidden md:block">
          <h2 className="text-base font-semibold text-gray-800">Công ty</h2>
          <FooterItem text="Blog" />
          <FooterItem text="Về chúng tôi" />
          <FooterItem text="Liên hệ" />
        </div>

        {/* Hỗ trợ */}
        <div className="hidden md:block">
          <h2 className="text-base font-semibold text-gray-800">Hỗ trợ</h2>
          <FooterItem text="Điều khoản pháp lý" />
          <FooterItem text="Chính sách" />
          <FooterItem text="Chính sách bảo mật" />
        </div>

        {/* Liên hệ */}
        <div>
          <h2 className="text-base font-semibold text-gray-800">Liên hệ</h2>
          <FooterItem text="Shoes Nepal" />
          <FooterItem text="Vị trí cửa hàng" />
          <FooterItem text="Thông tin liên hệ" />
        </div>
      </div>
    </div>
  );
};

export default Footer;

/* ------------------ COMPONENT PHỤ ------------------ */

const FooterItem = ({ text }) => (
  <button
    type="button"
    title="Chức năng đang phát triển"
    className="block mt-6 text-base text-gray-800 opacity-60 cursor-not-allowed text-left"
  >
    {text}
  </button>
);

const SOCIAL_ICONS = [
  {
    label: "Instagram",
    bg: "bg-[#e95950]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <circle cx="12" cy="12" r="4" />
        <rect x="2" y="2" width="20" height="20" rx="6" />
      </svg>
    ),
  },
  {
    label: "Website",
    bg: "bg-[#00008B]",
    icon: <span className="text-xs font-bold text-white">W</span>,
  },
  {
    label: "LinkedIn",
    bg: "bg-[#0072b1]",
    icon: <span className="text-xs font-bold text-white">in</span>,
  },
  {
    label: "YouTube",
    bg: "bg-[#FF0000]",
    icon: <span className="text-xs font-bold text-white">▶</span>,
  },
];
