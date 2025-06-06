import React from 'react';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`border border-zinc-300 dark:border-zinc-600 rounded-lg px-4 h-12 w-full
      focus:border-zinc-500 dark:focus:border-zinc-400 outline-none transition-colors
      bg-transparent ${className || ''}`}
      {...props}
    />
  );
}