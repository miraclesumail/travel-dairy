/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-11-29 20:18:38
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-12-04 15:27:04
 * @FilePath: /travel-dairy/src/app/frame-motion/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import {
  ReactElement,
  Children,
  isValidElement,
  cloneElement,
  useRef,
  useLayoutEffect,
  useState,
  CSSProperties,
} from 'react';
import Trend from './trend';
import { motion, Variants } from 'motion/react';
import { Tooltip } from '@nextui-org/tooltip';
import Test from './test';
// import ToolTip from './tooltip';

const MyToolTip = ({ children, content }: any) => {
  const [style, setStyle] = useState<CSSProperties>({});
  const [isOpen, setOpen] = useState<boolean>(false);
  let triggerRef = useRef<HTMLElement>();

  let trigger: ReactElement;

  try {
    const childrenNum = Children.count(children);
    if (childrenNum !== 1) throw new Error();

    if (!isValidElement(children)) {
      trigger = <p>{children}</p>;
    } else {
      const child = children as React.ReactElement & {
        ref?: React.Ref<any>;
      };

      trigger = cloneElement(child, { ...child.props, ref: (node: any) => (triggerRef.current = node) });
    }
  } catch (err) {
    trigger = <span />;
    console.warn('Tooltip must have only one child node. Please, check your code.');
  }

  useLayoutEffect(() => {
    console.log(triggerRef.current?.getBoundingClientRect(), 'getBoundingClientRect');

    triggerRef.current?.addEventListener('mouseover', () => setOpen(true));
    triggerRef.current?.addEventListener('mouseleave', () => setOpen(false));

    const { x, bottom, width, height } = triggerRef.current?.getBoundingClientRect()!;
    setStyle({
      position: 'absolute',
      zIndex: 10,
      top: bottom + 15 + 'px',
      left: x + width / 2 + 'px',
      transform: 'translateX(-50%)',
    });
  }, []);

  return (
    <>
      {trigger}
      {isOpen ? <div style={style}>{content}</div> : null}
    </>
  );
};

export default function Page() {
  return (
    <>
      <Test />
      <MyToolTip content={<div>点击的角度看</div>}>
        <div className='absolute left-[300px] top-[100px]'>ddjdkdk</div>
      </MyToolTip>
      {/* <Tooltip content='I am a tooltip' isOpen>
        <div className='w-[100px]'>Hover me</div>
      </Tooltip> */}
      {/* <ToolTip conetnt={<div>this is toop</div>}>
        <div className='flex flex-col'>
          <span>dddd9999</span>
          <span>eeee</span>
        </div>
      </ToolTip> */}
      {/* <Trend /> */}
    </>
  );
}
