import React, { useState } from "react";
import { NotifyInfo } from "../../../toastify";

export default function Categorys({ category, setCategory, AddProductData }) {
    const ENTER = 13;
    const COMMA = 188;
    const SPACE = 32;
    const BACKSPACE = 8;
    const [value, setValue] = useState("");

    const addCategory = () => {
        let addCat = value.trim().replace(/,/g, "");
        if (!addCat) return;
        if (category.find((t) => t.toLowerCase() === addCat.toLowerCase())) return;
        setCategory({ ...AddProductData, category: [...category, addCat] });
        setValue("");
    };
    const resetCategory = () => {
        setValue("");
        setCategory({
            ...AddProductData, category: ["Nam", "Nữ", "Trẻ em"]
        })
    };
    const editCategory = () => setValue(category.pop());

    return (
        <div className="
                flex flex-wrap
                items-center
                justify-center
                w-full
            ">
            {category?.map((cat, index) => (
                <div key={index} className="
                flex items-center
                        bg-gray-100
                        rounded-full
                        px-[0.6rem] py-1
                         mb-0 mr-2
                        text-sm
                        text-black
                        font-normal
                    ">
                    {cat}
                    <button
                        type="button"
                        className="
                        ml-[0.3rem]
                        flex-shrink-0
                        flex
                        items-center
                        justify-center
                        h-4 w-4
                        rounded-full
                        bg-[#fe2856]
                        text-white
                        leading-none
                        focus:outline-none
                        focus:ring-2
                        focus:ring-offset-2
                        focus:ring-offset-gray-100
                        focus:ring-[#fe2856]
                        "
                        onClick={() => {
                            setCategory({
                                ...AddProductData,
                                category: category.filter((t) => t !== cat || category.length === 1),
                            });
                            if (category.length === 1) {
                                NotifyInfo("Bạn phải có ít nhất một danh mục");
                            }
                        }}
                    >
                        <span className="sr-only">Xóa danh mục</span>
                        <svg
                            className="h-2 w-2"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 8 8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M1 1l6 6M1 7l6-6"
                            />
                        </svg>
                    </button>
                </div>
            ))}
            <button type="button" className=" bg-gray-100 rounded-full px-3 py-1 mb-0 mr-2 text-sm
                        text-black font-normal" onClick={resetCategory}> Đặt lại </button>
            {/* <input
                type="text"
                placeholder="Nhấn Enter, dấu cách hoặc dấu phẩy để thêm danh mục"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
            /> */}
        </div>
    );
}
