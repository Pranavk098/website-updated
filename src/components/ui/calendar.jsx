import React from 'react';

export function Calendar({ selected, onChange }) {
  if (typeof onChange !== 'function') {
    console.error("Calendar component expects 'onChange' to be a function.");
    return null;
  }

  return (
    <input
      type="date"
      value={selected}
      onChange={(e) => onChange(e.target.value)}  // Ensure correct event handling
      className="border p-2 rounded-md"
    />
  );
}
