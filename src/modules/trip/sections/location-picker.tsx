import { Input } from '@/components/ui/input';
import useOutsideClick from '@/hooks/use-outside-click';
import { cn, debounce } from '@/lib/utils';
import { GeoapifyAutocompleteResponse } from '@/modules/types';
import { Loader2Icon } from 'lucide-react';
import { useRef, useState } from 'react'

type Props = {
  setAddress: (val: string) => void
  setLatitude: (val: string) => void
  setLongitude: (val: string) => void
  title?: string
  accepted: boolean
}

export const LocationPicker = ({
  setAddress,
  setLatitude,
  setLongitude,
  title,
  accepted,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [options, setOptions] = useState<GeoapifyAutocompleteResponse[]>([]);
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onInputChange = debounce(() => {
    setError("");

    if (!inputRef.current?.value) return

    const value = inputRef.current.value
    setLoading(true)

    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&format=json&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`)
      .then(res => res.json())
      .then(res => {

        setOptionsOpen(true)
        if (!res?.results?.length) {
          setOptions([])
        } else {

          setOptions(res.results.map((item: GeoapifyAutocompleteResponse) => ({
            formatted: item.formatted,
            lat: item.lat,
            lon: item.lon,
          })))
        }
      })
      .finally(() => setLoading(false))
  }, 1000)


  const applySelect = (address: string) => {
    if (!inputRef.current) return;

    inputRef.current.value = address;

    const selectedOption = options.find(item => item.formatted === address);

    if (selectedOption) {
      
      setAddress(selectedOption.formatted);
      setLatitude(selectedOption.lat);
      setLongitude(selectedOption.lon);

      setOptionsOpen(false);
    }
  }

  useOutsideClick([containerRef], () => {
    setOptionsOpen(false);
  })

  return (
    <div ref={containerRef}>
      <h2 className="text-lg font-bold mb-2">■ {title} location</h2>
      <div className="relative">
        <Input
          ref={inputRef}
          onChange={onInputChange}
          placeholder="Find address"
          className={cn(
            "w-full",
            error && "outline-red-500 border-red-500",
            accepted && "outline-green-500 border-green-500"
          )}
        />
        {loading && <Loader2Icon className="absolute right-1.5 top-1/2 -translate-y-1/2 animate-spin" />}
      </div>

      <div className="text-sm mt-2 smallScrollbar overflow-y-scroll max-h-24">
        {optionsOpen && (options.length
          ? options.map((opt, i) => (
            <div
              role="button"
              key={`cur_${opt.formatted}_${i}`}
              onClick={() => applySelect(opt.formatted)}
              className="p-2 rounded cursor-pointer hover:bg-neutral-200 transition"
            >
              {opt.formatted}
            </div>
          ))
        : <div>No items.</div>)}
      </div>
    </div>
  )
}
