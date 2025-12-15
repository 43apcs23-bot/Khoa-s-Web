import React from "react";

export default function ShoeForOption({ shoeFor, setShoeFor, AddProductData }) {
    const options = ['Quần', 'Áo', 'Giày', 'Ba lô']
    return (
        <div className="flex flex-wrap items-center justify-start w-full gap-2">
            {options.map((opt) => (
                <button key={opt} type='button' onClick={() => setShoeFor({ ...AddProductData, shoeFor: opt })} className={`px-3 py-2 rounded ${shoeFor === opt ? 'bg-rose-600 text-white' : 'bg-gray-100 text-black'}`}>
                    {opt}
                </button>
            ))}
        </div>
    )
}
