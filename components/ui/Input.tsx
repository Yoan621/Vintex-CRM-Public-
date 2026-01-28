import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

/**
 * Composant Input moderne avec la charte graphique Vintex
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-4 py-2.5 rounded-lg border transition-all duration-200 text-gray-900 placeholder:text-grayMedium'
    const stateClasses = error
      ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
      : 'bg-grayLight border-gray-200 focus:border-primaryLight focus:ring-2 focus:ring-primaryLight/20'

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-900 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseClasses} ${stateClasses} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-grayMedium">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
