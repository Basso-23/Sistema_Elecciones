import React from "react";

const InputForm = ({ name, value, placeholder, type, onChange }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="border-b focus:border-[#0989FF]  focus:outline-none"
      required
    />
  );
};

export default InputForm;
