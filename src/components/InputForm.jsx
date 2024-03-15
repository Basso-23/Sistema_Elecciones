import React from "react";

const InputForm = ({ name, value, placeholder, onChange }) => {
  return (
    <input
      type="text"
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
