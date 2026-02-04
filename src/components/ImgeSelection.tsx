"use client";

import { useState, useEffect } from "react";

type ImageSelectorProps = {
  value: string; // trenutno izabrana slika (relativni path)
  onChange: (val: string) => void;
};

export default function ImageSelector({ value, onChange }: ImageSelectorProps) {
  const [images, setImages] = useState<string[]>([]);
  const [open, setOpen] = useState(false);


  useEffect(() => {

    setImages([
      "/ucionica1.jpeg",
      "/ucionica2.jpeg",
      "/konferencijska1.jpeg",
      "/konferencijska2.jpeg"

    ]);
  }, []);

  return (
    <div className="relative w-64">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-2 border border-gray-300 rounded flex items-center justify-between"
      >
        {value ? (
          <span className="flex items-center gap-2">
            <img src={value} alt="Izabrana" className="w-6 h-6 object-cover rounded" />
            <span>{value.split("/").pop()}</span>
          </span>
        ) : (
          <span>Izaberi sliku</span>
        )}
        <span>▼</span>
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-auto z-50">
          {images.map((img) => (
            <div
              key={img}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(img);
                setOpen(false);
              }}
            >
              <img src={img} alt={img} className="w-10 h-10 object-cover rounded" />
              <span>{img.split("/").pop()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}