import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options?: { value: string; label: string }[]
}

/**
 * Composant Select moderne avec la charte graphique Vintex
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', children, ...props }, ref) => {
    const baseClasses = 'w-full px-4 py-2.5 rounded-lg border transition-all duration-200 text-gray-900 cursor-pointer'
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
        <select
          ref={ref}
          className={`${baseClasses} ${stateClasses} ${className}`}
          {...props}
        >
          {options ? (
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
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

Select.displayName = 'Select'

export default Select
