"use client"

import { useRouter } from 'next/navigation';
import React, { FormEvent, MouseEvent, useState } from 'react'


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DutyStatus, dutyStatusOptions, Increment, Logbook, Remark } from '../../types/logbook';
import { cn, debounce, incrementIndexToHourString } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const LogbookEdit = ({logbook}: {logbook: Logbook}) => {
  
  const router = useRouter();

  const [increments, setIncrements] = useState<Increment[]>(logbook.increments);
  const [selection, setSelection] = useState<[number, number] | [null, null]>([null, null])

  const handleClick = (di: number, ii: number) => {
    setSelection([di, ii]);
    setIncrements(prev => prev.map((inc, i) => i === ii ? ({...inc, dutyStatus: dutyStatusOptions[di]}) : inc))
  }

  const handleMouseOver = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, di: number, ii: number) => {
    if (e.buttons === 1) {
      setIncrements(prev => prev.map((inc, i) => i === ii ? ({...inc, dutyStatus: dutyStatusOptions[di]}) : inc))
    }
  }

  const handleChange = debounce((e: FormEvent<HTMLInputElement>, incrementIndex: number, field: string) => {
    setIncrements(prev => prev.map((inc, i) => {
      if (i !== incrementIndex) return inc;

      const curRemark: Remark = {
        state: inc.remark?.state || "",
        city: inc.remark?.city || "",
        commodity: inc.remark?.commodity || "",
        detail: inc.remark?.detail || "",
        latitude: inc.remark?.latitude,
        longitude: inc.remark?.longitude,
        [field]: (e.target as HTMLInputElement).value
      };

      return ({
        ...inc,
        remark: curRemark
      })
    }))
  }, 200)

  const saveLogbook = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()


    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/logbook/" + logbook.id, {
        method: "PATCH",
        body: JSON.stringify({
          "increments": increments.map(increment => {
            if (increment.remark === null) {
              const { remark, ...rest } = increment; // Remove remark if it's null
              return rest;
            }
            return increment;
          })
      })})
      .then(res => res.json())
      .then(res => {
        if (res.id) {
          router.push("/logbook/visualize/" + res.id)
        }
      })
      .catch(console.error)
  }


  return (
    <form onSubmit={saveLogbook} className="pt-4">
      <div className="md:ml-[unset] ml-6 mb-6 select-none flex md:flex-col">
        <div className="flex md:flex-row flex-col pb-6 pt-12 -ml-2 md:mb-8 text-xs">
          <div className="md:w-32 w-24"></div>

          {increments.map((_, i) => (
            <div key={`hrs_${i}`} className="md:border-b-0 border-b-2 md:w-8 md:h-[unset] h-16 leading-16 md:leading-[unset] md:rotate-[70deg] overflow-visible text-nowrap flex pl-2 md:pl-[unset]">
              {incrementIndexToHourString(i)}{" - "}{incrementIndexToHourString(i + 1)}
            </div>
          ))}
        </div>
        {dutyStatusOptions.map((_, di) => (
          <div key={`di${di}`} className="flex md:flex-row items-stretch flex-col md:h-20">
            <div className="w-32 font-bold leading-20 md:block hidden">{dutyStatusOptions[di]}</div>
            <div className="md:hidden h-12"></div>
            
            {increments.map((inc, ii) => (
              <div
                key={`di${di}_ii${ii}`}
                onClick={() => handleClick(di, ii)}
                onMouseOver={e => handleMouseOver(e, di, ii)}
                className={cn(
                  'md:h-[unset] h-16 md:w-8 w-16 border rounded shadow border-neutral-800 transform cursor-pointer',
                  dutyStatusOptions[di] === inc.dutyStatus && "bg-neutral-500",
                  !(di === selection[0] && ii === selection[1]) && "hover:bg-neutral-200",
                  (dutyStatusOptions[di] === inc.dutyStatus && inc.remark != null) && "bg-amber-500",
                  di === selection[0] && ii === selection[1] && "bg-amber-300 hover:bg-amber-400",
                )}
              ></div>
            ))}
          </div>
        ))}
      </div>


      <div className="flex justify-between items-start">
        <h1 className={cn(
          "w-64 px-4 py-2 mb-8 text-2xl font-bold border-neutral-600 dark:border-neutral-400",
          selection[1] != null && "border-b-2"
        )}>
           {selection[1] != null && "Details"}
        </h1>

        <Button className="mt-1 w-32 h-12 text-lg" variant="default">Save</Button>
      </div>

      <div className="w-fit flex flex-col">
        {selection[1] != null && (
          <>
            <div className="flex items-center gap-2 pb-2">
              <span className="w-28">Status:</span>
              <Select onValueChange={(val: DutyStatus) => {
                setIncrements(prev => prev.map((inc, i) => i === selection[1] ? ({...inc, dutyStatus: val}) : inc))
                setSelection(prev => {
                  if (!prev[1]) return prev;
                  return ([dutyStatusOptions.findIndex(item => item === val), prev[1]])
                })
              }}>
                <SelectTrigger className="w-96">
                  <SelectValue placeholder="Select status"></SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {dutyStatusOptions.map(opt => (
                    <SelectItem className="" key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {increments[selection[1]].remark != null && (
              <div className="flex flex-col gap-2">
                <Label>
                  <p className="w-28">State:</p>
                  <Input onInput={(e) => handleChange(e, selection[1], "state")} className="w-96" defaultValue={increments[selection[1]].remark?.state} />
                </Label>
                <Label>
                  <p className="w-28">City:</p>
                  <Input onInput={(e) => handleChange(e, selection[1], "city")}  className="w-96" defaultValue={increments[selection[1]].remark?.city} />
                </Label>
                <Label>
                  <p className="w-28">Commodity:</p>
                  <Input onInput={(e) => handleChange(e, selection[1], "commodity")} className="w-96" defaultValue={increments[selection[1]].remark?.commodity} />
                </Label>
                <Label>
                  <p className="w-28">Detail:</p>
                  <Input onInput={(e) => handleChange(e, selection[1], "detail")} className="w-96" defaultValue={increments[selection[1]].remark?.detail} />
                </Label>
              </div>
            )}
            <div className="flex flex-row self-end gap-4 mt-12">
              <Button className="mt-1 w-32 h-12 text-lg bg-neutral-700" variant="default" type="button" onClick={() => {
                setIncrements(prev => prev.map((inc, i) => i === selection[1] ? ({...inc, remark: {
                  city: "", state: "", commodity: "", detail: ""
                }}) : inc))
              }}>Add remark</Button>
            </div>
          </>
        )}

      </div>
    </form>
  )
}
