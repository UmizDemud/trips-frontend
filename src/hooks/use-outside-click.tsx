import { useEffect, RefObject } from 'react';

/**
 * Hook that handles outside click event of the passed refs
 *
 * @param refs array of refs
 * @param handler a handler function to be called when clicked outside
 */
export default function useOutsideClick(
  refs: Array<RefObject<HTMLElement | SVGSVGElement | null> | undefined>,
  handler?: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!handler) return;

      // Clicked browser's scrollbar
      if (
        event.target === document.getElementsByTagName('html')[0] &&
        event.clientX >= document.documentElement.offsetWidth
      )
        return;

      let containedToAnyRefs = false;
      for (const rf of refs) {
        if (rf && rf.current && rf.current.contains(event.target as Node)) {
          containedToAnyRefs = true;
          break;
        }
      }

      // Not contained to any given refs
      if (!containedToAnyRefs) {
        handler();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', (e) => handleClickOutside(e));
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, handler]);
}
