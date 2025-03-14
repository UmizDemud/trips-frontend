"use client"

import { useState } from "react"
import { DutyStatus, Increment, Logbook, Remark } from "../../types/logbook"
import { IncrementField } from "../logbook-form/increment"

export const LogbookForm = ({logbook}: {logbook: Logbook}) => {
  const [increments, setIncrements] = useState<Increment[]>(logbook.increments);

  const createChangeIncrementStatus = (index: number) => {
    return (value: DutyStatus) => {
      setIncrements(prev => {
        const newIncrements = [...increments];
        newIncrements[index] = {
          ...newIncrements[index],
          dutyStatus: value
        }

        return newIncrements;
      })
    }
  }

  const createChangeRemark = (index: number) => {
    return (value: Remark | undefined) => {
      setIncrements(prev => {
        const newIncrements = [...increments];
        newIncrements[index] = {
          ...newIncrements[index],
          remark: value
        }

        return newIncrements;
      })
    }
  }

  return (
    <div className="flex flex-col gap-2 w-96">
      <h1 className="text-center text-2xl font-bold border-b-4 border-neutral-600 px-4 pb-4 mb-4">Enter Logbook</h1>
      {Array(48).fill(0).map((_, i) => (
        <IncrementField
          index={i}
          key={`inc_${i}`}
          status={increments[i].dutyStatus}
          setStatus={createChangeIncrementStatus(i)}
          remark={increments[i].remark}
          setRemark={createChangeRemark(i)}
        />
      ))}
    </div>
  )
}
