import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { track, TrackType } from '@/app/utils/tracker';

export default function usePageStay(pageName?: string) {
  const pathname = usePathname();

  const startTimeRef = useRef<number>(Date.now());
  const hiddenTimeRef = useRef<number | null>(null);
  const totalHiddenTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    totalHiddenTimeRef.current = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTimeRef.current = Date.now();
      } else if (hiddenTimeRef.current) {
        totalHiddenTimeRef.current += Date.now() - hiddenTimeRef.current;
        hiddenTimeRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      const now = Date.now();
      const totalTime = now - startTimeRef.current;
      const effectiveTime = totalTime - totalHiddenTimeRef.current;
    //   alert(`${effectiveTime}--- effectiveTimeeffectiveTime`)
   
      track(TrackType.PAGE_STAY, {
        url: pathname,
        duration: effectiveTime,
        userId: '888',
        time: Date.now()
      })
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname]);
}
