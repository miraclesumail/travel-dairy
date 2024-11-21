/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-23 17:01:24
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-23 17:53:27
 * @FilePath: /travel-dairy/src/hooks/useIntersection.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { useEffect, useRef } from 'react';

type Props = {
  callback: (entries: IntersectionObserverEntry[]) => void;
  options: Partial<IntersectionObserverInit> & { once?: boolean };
};

export default function useIntersectionObserver({ callback, options }: Props) {
  const obRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    console.log(obRef.current)
    const { once } = options;
    let observer: IntersectionObserver | null = null;
    if (obRef.current) {
      observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && once) observer?.disconnect();
        callback(entries);
      }, options);
      observer.observe(obRef.current);
    }

    return () => observer?.disconnect();
  }, [obRef.current]);

  return {
    obRef,
  };
}
