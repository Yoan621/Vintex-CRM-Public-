import { TdHTMLAttributes, ReactNode } from 'react'

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

/**
 * Composant TableCell avec padding généreux
 */
export default function TableCell({ children, className = '', ...props }: TableCellProps) {
  return (
    <td className={`px-6 py-4 text-sm text-gray-700 ${className}`} {...props}>
      {children}
    </td>
  )
}
