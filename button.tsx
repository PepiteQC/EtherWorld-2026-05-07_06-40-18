import * as React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'neon'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg font-mono transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    default:
      'bg-[rgba(106,90,205,0.4)] text-white border border-[rgba(139,92,246,0.5)] hover:bg-[rgba(106,90,205,0.6)] shadow-[0_0_15px_rgba(106,90,205,0.3)]',
    outline:
      'bg-transparent text-purple-300 border border-purple-500 hover:bg-[rgba(139,92,246,0.15)]',
    ghost:
      'bg-transparent text-slate-300 hover:bg-[rgba(255,255,255,0.05)]',
    neon:
      'bg-transparent text-[#8b5cf6] border border-[#8b5cf6] shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] hover:bg-[rgba(139,92,246,0.1)]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}