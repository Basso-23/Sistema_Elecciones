import React from "react";

const InputForm = ({ name, value, placeholder, type, onChange }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="border rounded-md py-2 pl-4 text-sm focus:border-[#0989FF]  focus:outline-none w-full"
      required
    />
  );
};

export default InputForm;
