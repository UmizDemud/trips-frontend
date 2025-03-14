import { useRef, useState } from "react"
import { DutyStatus, dutyStatusOptions, Remark } from "../../types/logbook";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { incrementIndexToHourString } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



type Props = {
  index: number
  status: DutyStatus
  setStatus: (val: DutyStatus) => void
}


export const IncrementField = ({ index, status, setStatus }: Props) => {
  const [hasRemark, setHasRemark] = useState(false)

  const cityInputRef = useRef<HTMLInputElement | null>(null);
  const stateInputRef = useRef<HTMLInputElement | null>(null);
  const commodityInputRef = useRef<HTMLInputElement | null>(null);
  const detailInputRef = useRef<HTMLInputElement | null>(null);
  const latitudeInputRef = useRef<HTMLInputElement | null>(null);
  const longitudeInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="pb-2 border-2 border-transparent border-b-neutral-400">
      <h2 className="text-sm text-muted-foreground border-b pb-1 mb-2">{incrementIndexToHourString(index)} - {incrementIndexToHourString(index + 1)}</h2>
      <div className="flex justify-between items-center gap-2">
        <Label className="flex justify-between w-full">
          Duty Status:
          <Select
            onValueChange={setStatus}
            value={status}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {dutyStatusOptions.map(opt => (
                  <SelectItem key={`${index}_${opt}`} value={opt}>{opt}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="flex flex-col items-center cursor-pointer">
          Remark
          <Checkbox
            className="cursor-pointer"
            checked={hasRemark}
            onCheckedChange={(checked: CheckedState) => {
              setHasRemark(checked === true)
            }}
          />
        </Label>
      </div>
      <div className="py-2">
        {hasRemark && (
          <div className="flex flex-col gap-1">
            <Label className="flex justify-between items-center">
              State:
              <Input className="w-3/4" ref={stateInputRef} />
            </Label>
            <Label className="flex justify-between items-center">
              City:
              <Input className="w-3/4" ref={cityInputRef} />
            </Label>
            <Label className="flex justify-between items-center">
              Commodity:
              <Input className="w-3/4" ref={commodityInputRef} />
            </Label>
            <Label className="flex justify-between items-center">
              Description:
              <Input className="w-3/4" ref={detailInputRef} />
            </Label>
            <Label className="flex justify-between items-center">
              Latitude:
              <Input className="w-3/4" ref={latitudeInputRef} />
            </Label>
            <Label className="flex justify-between items-center">
              Longitude:
              <Input className="w-3/4" ref={longitudeInputRef} />
            </Label>
          </div>
        )}
      </div>
    </div>
  )
}
