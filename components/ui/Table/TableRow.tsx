import { HTMLAttributes, ReactNode } from 'react'

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

export function TableBody({ children, className = '', ...props }: TableBodyProps) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  )
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode
}

/**
 * Composant TableRow avec hover turquoise
 */
export default function TableRow({ children, className = '', ...props }: TableRowProps) {
  return (
    <tr
      className={`border-b border-gray-100 hover:bg-turquoise/5 transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </tr>
  )
}
