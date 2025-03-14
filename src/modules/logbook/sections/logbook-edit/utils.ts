import { FormEvent } from "react";

export const debouncer = (func: (e: FormEvent<HTMLInputElement>, incrementIndex: number, field: string) => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (e: FormEvent<HTMLInputElement>, incrementIndex: number, field: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(e, incrementIndex, field)
    }, wait);
  };
}