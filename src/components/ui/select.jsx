import React from 'react';

export function Select({ value, onChange, children }) {
  if (typeof onChange !== 'function') {
    console.error("Select component expects 'onChange' to be a function.");
    return null;
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}  // Proper onChange call
      className="border p-2 rounded-md"
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
