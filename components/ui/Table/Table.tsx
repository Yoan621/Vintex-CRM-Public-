import { HTMLAttributes, ReactNode } from 'react'

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode
}

/**
 * Composant Table moderne avec la charte graphique Vintex
 */
export default function Table({ children, className = '', ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full ${className}`} {...props}>
        {children}
      </table>
    </div>
  )
}
