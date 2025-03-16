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
    <div className="w-full flex md:flex-row flex-col gap-12">
      <Link href={`/logbook/visualize/${logbook.id}`} className="h-fit block flex-1">
        <DynamicLogbookSketch logbook={logbook} />
      </Link>

      <div className='max-h-[562px] smallScrollbar overflow-y-scroll flex-1 md:pr-8 md:pl-4 pl-2'>
        <div>
          {logbook.increments.map((inc: Increment, i: number) => (
            <p key={i} className="flex gap-2 border-b md:px-4 border-neutral-300">
              <span className="flex w-32">
                <span className="flex justify-center w-16 text-justify mr-1">
                  {incrementIndexToHourString(i)}
                </span>
                -
                <span className="flex justify-center w-16 text-justify ml-1">
                  {incrementIndexToHourString(i + 1)}
                </span>
              </span>

              <span className="flex gap-8">
                <span className='block w-32'>{inc.dutyStatus}</span>
                <span className='block max-w-[12rem] overflow-ellipsis overflow-hidden whitespace-nowrap'>{inc.remark ? inc.remark.detail : ""}</span>
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
