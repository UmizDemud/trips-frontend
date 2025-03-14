export const debouncer = (func: () => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func()
    }, wait);
  };
}