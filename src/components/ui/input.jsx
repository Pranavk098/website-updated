import React from 'react';

export function Input({ value, onChange, placeholder }) {
  if (typeof onChange !== 'function') {
    console.error("Input component expects 'onChange' to be a function.");
    return null;
  }

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}  // Ensure this line has correct prop
      placeholder={placeholder}
      className="border p-2 rounded-md w-full"
    />
  );
}
