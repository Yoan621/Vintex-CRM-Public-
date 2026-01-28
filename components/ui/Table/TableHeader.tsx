import { HTMLAttributes, ReactNode } from 'react'

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode
}

/**
 * Composant TableHeader avec fond grayLight
 */
export default function TableHeader({ children, className = '', ...props }: TableHeaderProps) {
  return (
    <thead className={`bg-grayLight border-b border-gray-200 ${className}`} {...props}>
      {children}
    </thead>
  )
}

interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

export function TableHead({ children, className = '', ...props }: TableHeadProps) {
  return (
    <th
      className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </th>
  )
}
