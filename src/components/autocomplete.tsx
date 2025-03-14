import { useRef } from 'react';
import { Input } from './ui/input'
import { cn, debounce } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';

type Props = {
  _key: string
  loading: boolean
  error: boolean
  onChange: () => void
  options: string[]
}

export const Autocomplete = ({
  _key,
  loading,
  error,
  onChange,
  options
}: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div className="relative">
        <Input
          ref={ref}
          onChange={onChange}
          placeholder="Find address"
          className={cn("w-full", error && "outline-red-500 border-red-500")}
        />
        {!loading && <Loader2Icon className="absolute right-0 top-1/2 -translate-y-1/2 animate-spin" />}
      </div>

      <div className="text-sm mt-2">
        {options.length
          ? options.map(opt => (
            <div
              key={`${_key}_${opt}`}
              className="p-2 rounded cursor-pointer hover:bg-neutral-200 transition"
            >
              {opt}
            </div>
          ))
          : <div>No items.</div>
        }
      </div>
    </>
  )
}
