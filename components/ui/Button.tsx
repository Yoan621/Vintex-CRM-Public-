import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

/**
 * Composant Button avec la charte graphique Vintod
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2'

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-[#0052CC] hover:shadow-[0_4px_12px_rgba(0,102,255,0.3)] active:scale-[0.98] shadow-soft',
    secondary: 'bg-cyan text-white hover:bg-[#00C4E6] hover:shadow-[0_4px_12px_rgba(0,217,255,0.3)] active:scale-[0.98] shadow-soft',
    outline: 'border-2 border-black bg-transparent text-black hover:bg-cyan hover:border-cyan hover:text-white active:scale-[0.98]',
    ghost: 'text-grayDark hover:bg-grayLight active:bg-grayMedium',
    destructive: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-soft'
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
