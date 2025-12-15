import React from "react";
import { NotifyInfo } from "../../../toastify";

export default function Categorys({ category, setCategory, AddProductData }) {
    const options = ['Nam', 'Nữ', 'Trẻ em']

    const toggle = (opt) => {
        const current = Array.isArray(category) ? category : (category ? category : [])
        let next
        if (current.includes(opt)) {
            // prevent removing last category
            if (current.length === 1) {
                NotifyInfo('Bạn phải có ít nhất một danh mục')
                return
            }
            next = current.filter(c => c !== opt)
        } else {
            next = [...current, opt]
        }
        setCategory({ ...AddProductData, category: next })
    }

    const resetCategory = () => {
        setCategory({ ...AddProductData, category: [...options] })
    }

    return (
        <div className="flex flex-wrap items-center justify-start w-full gap-2">
            {options.map((opt) => {
                const active = Array.isArray(category) ? category.includes(opt) : (category ? category.includes(opt) : false)
                return (
                    <button key={opt} type='button' onClick={() => toggle(opt)} className={`px-3 py-2 rounded ${active ? 'bg-rose-600 text-white' : 'bg-gray-100 text-black'}`}>
                        {opt}
                    </button>
                )
            })}
            <button type="button" className=" bg-gray-100 rounded-full px-3 py-1 mb-0 mr-2 text-sm text-black font-normal" onClick={resetCategory}> Đặt lại </button>
        </div>
    )
}
