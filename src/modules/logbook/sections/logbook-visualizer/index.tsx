"use client"

import { Increment, Logbook } from '../../types/logbook'
import { incrementIndexToHourString } from '@/lib/utils'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const DynamicLogbookSketch = dynamic(
  () => import('./logbook-sketch'),
  { ssr: false }
)

export const LogbookVisualizer = ({logbook}: {logbook: Logbook}) => {

  return (
    <div className="w-full flex gap-12">
      <Link href={`/logbook/visualize/${logbook.id}`} className="border border-black h-fit">
        <DynamicLogbookSketch logbook={logbook} />
      </Link>

      <div className='max-h-[562px] max-w-[520px] smallScrollbar overflow-y-scroll flex-1 pr-8 pl-4'>
        <div>
          {logbook.increments.map((inc: Increment, i: number) => (
            <p key={i} className="flex gap-2">
              <span className="flex w-32">
                <span className="block w-12">
                  {incrementIndexToHourString(i)}
                </span>
                -
                <span className="block w-14 ml-2">
                  {incrementIndexToHourString(i + 1)}
                </span>
              </span>

              <span className="block">
                {inc.dutyStatus}{inc.remark ? ` - ${inc.remark.detail}` : ""}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
