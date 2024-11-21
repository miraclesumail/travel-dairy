/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-11 15:01:53
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-11-18 23:11:35
 * @FilePath: /nextjs/travel-dairy/src/app/test1/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import React, { memo, ReactNode } from 'react';
import { useEffect } from 'react';
import { Page } from './page';

interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  what: string;
}

const testCard: CardProps = {
  what: 'WWW',
};

export const CMP1 = memo(() => {
  useEffect(() => {
    console.log('render CMP1');
  });

  return <div>CMP1</div>;
});

export const CMP2 = () => {
  useEffect(() => {
    console.log('render CMP2');
  });

  return <div>CMP2</div>;
};

export const CMP3 = ({ count }: any) => {
  useEffect(() => {
    console.log('render CMP3');
  });

  return <div>CMP3 - {count}</div>;
};

export type Person = {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'ladyboby' | 'unknown';
};

export const persons: Person[] = [
  { name: 'hanleilei', age: 18, gender: 'female' },
  { name: 'lilei', age: 18, gender: 'male' },
];

interface GenProps<T> {
  data: Array<T>;
  render: (data: T) => ReactNode;
}

export function GenericCmp<T>(params: GenProps<T>) {
  const { data, render } = params;

  return (
    <div>
      <div>this is a generic component</div>
      <div>{data.map((item) => render(item))}</div>
    </div>
  );
}

export default Page;
