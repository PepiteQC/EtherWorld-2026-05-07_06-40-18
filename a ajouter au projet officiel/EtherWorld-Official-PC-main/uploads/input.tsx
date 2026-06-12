import * as React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-mono text-purple-300 tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`
          bg-[rgba(15,23,42,0.8)]
          border border-[rgba(139,92,246,0.3)]
          rounded-lg
          px-3 py-2
          text-sm font-mono text-white
          placeholder:text-slate-500
          outline-none
          focus:border-[rgba(139,92,246,0.8)]
          focus:shadow-[0_0_15px_rgba(139,92,246,0.3)]
          transition-all duration-200
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs font-mono text-red-400">{error}</span>
      )}
    </div>
  )
}