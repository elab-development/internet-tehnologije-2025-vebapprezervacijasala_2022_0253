"use client";

type FormFieldProps = {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: string | number;
};

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium text-gray-700">{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-[#7B542F] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6771D]"
      />
    </div>
  );
}