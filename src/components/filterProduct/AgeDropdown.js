import React, { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { Menu } from '@headlessui/react';
import { FaChild } from 'react-icons/fa'; // icon đại diện Age
// không dùng redux vì list options cố định

const AgeDropdown = ({ value, setValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ['Tất cả', 'Nam', 'Nữ', 'Trẻ em'];

  return (
    <Menu as="div" className="dropdown relative">
      <Menu.Button
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-btn w-full text-left"
      >
        <FaChild className="dropdown-icon-primary" />
        <div>
          <div className="text-[15px] font-medium leading-tight">{value || 'Tất cả'}</div>
          <div className="text-[13px]">Chọn độ tuổi / giới tính</div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className="dropdown-icon-secondary" />
        ) : (
          <RiArrowDownSLine className="dropdown-icon-secondary" />
        )}
      </Menu.Button>

      <Menu.Items className="dropdown-menu">
        {options.map((option, index) => (
          <Menu.Item
            as="li"
            key={index}
            onClick={() => setValue(option)}
            className="cursor-pointer hover:text-rose-700 transition"
          >
            {option}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default AgeDropdown;
