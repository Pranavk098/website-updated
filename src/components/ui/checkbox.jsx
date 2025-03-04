import React from 'react';

export function Checkbox({ checked, onChange }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4"
    />
  );
}
