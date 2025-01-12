/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-12-01 22:40:19
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-12-01 23:23:45
 * @FilePath: /travel-dairy/src/app/frame-motion/tooltip.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';

import { MutableRefObject, ReactNode, useRef, useState } from 'react';

type Position = 'top' | 'right' | 'bottom' | 'left';

interface Props {
  children: ReactNode;
  conetnt: ReactNode;
  classname?: string;
  position?: Position;
}

export default function ToolTip({ children, position = 'right', conetnt, classname }: Props) {
  const ref: MutableRefObject<HTMLDivElement | undefined> = useRef<HTMLDivElement>();
  const [show, setShow] = useState<boolean>(false);

  function onMouseEnter() {
    setShow(true);
  }

  function onMouseLeave() {
    setShow(false);
  }

  function getStyle() {
    const { right, top, width, height, left } = ref.current?.getBoundingClientRect()!;

    console.log(right, left, width);
    return {
      left: right + 50 + 'px',
      top: top + 50 + 'px',
    };
  }

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={ref as any} className='max-w-fit'>
      {children}
      {show ? (
        <div className={`fixed z-100 bg-red-200 ${classname}`} style={getStyle()}>
          {conetnt}
        </div>
      ) : null}
    </div>
  );
}
