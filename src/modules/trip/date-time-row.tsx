"use client"

import { TableCell } from '@/components/ui/table'

export const DateTimeRow = ({date}: {date: Date}) => {
  return (
    <TableCell>
      <div>
        {date.toLocaleTimeString()}
      </div>

      <div>
        {date.toLocaleDateString()}
      </div>
    </TableCell>
  )
}
