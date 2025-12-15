import React, { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { TbDiscount } from 'react-icons/tb';
import { Menu } from '@headlessui/react';
import { useSelector } from 'react-redux';

const ProductDropdown = ({ Category, setCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { categoryData } = useSelector((state) => state.filterShoes);

  return (
    <Menu as='div' className='dropdown relative'>
      <Menu.Button
        onClick={() => setIsOpen(!isOpen)}
        className='dropdown-btn w-full text-left'
      >
        <TbDiscount className='dropdown-icon-primary' />
        <div>
          <div className='text-[15px] font-medium leading-tight'>
            {Category || 'Danh mục (tất cả)'}
          </div>
          <div className='text-[13px]'>Chọn danh mục</div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className='dropdown-icon-secondary' />
        ) : (
          <RiArrowDownSLine className='dropdown-icon-secondary' />
        )}
      </Menu.Button>

      <Menu.Items className='dropdown-menu'>
        {categoryData?.map((option, index) => (
          <Menu.Item
            as='li'
            key={index}
            onClick={() => setCategory(option)}
            className='cursor-pointer hover:text-rose-700 transition'
          >
            {option}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default ProductDropdown;
