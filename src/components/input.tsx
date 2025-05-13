import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 w-full mt-4
      focus-within:border-gray-800 dark:focus-within:border-zinc-100"
      {...props}
    />
  );
}