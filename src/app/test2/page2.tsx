/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-11 15:01:53
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-12-01 22:00:48
 * @FilePath: /nextjs/travel-dairy/src/app/test1/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import React, { ReactNode, memo } from 'react';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState, useTransition } from 'react';
import Optimistic from './useOptimistic';
import styles from './styles.module.scss';
import { useTeststore } from '@/app/test1/store';
import { useT } from '@/i18n';

export type Person = {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'ladyboby' | 'unknown';
};

export const persons: Person[] = [
  { name: 'hanleilei', age: 18, gender: 'female' },
  { name: 'lilei', age: 18, gender: 'male' },
];

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

export const Page = () => {
  const [num, setNum] = useState(0);
  const [count, setCount] = useState(0);
  const [multiples, setMultiples] = useState([] as JSX.Element[]);
  const { t } = useT('home');

  const [isPending, startTransition] = useTransition();

  const { age } = useTeststore((state) => state);

  function randomNumber() {
    return Math.floor(Math.random() * 100);
  }

  function generateMultiples(num: number) {
    startTransition(() => {
      setMultiples(
        Array.from(Array(10000).keys()).map((i) => (
          <div key={i} className={'m-0 p-0 col-1'}>
            {num * (i + 1)}
          </div>
        ))
      );
    });
  }

  useEffect(() => {
    if (num > 0) {
      generateMultiples(num);
    }
  }, [num]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNum(Number(e.target.value));
  };

  return (
    <div>
      this is {age} ---- {t('topone-product-to-provide')}
     {t('home.axiba')}--- {randomNumber()}
      <Optimistic />
      <div className={`w-[200px] h-[200px] rounded-full ${styles.wrapper} flex justify-center items-center`}>
        <div className='w-[100px] h-[100px] rounded-full bg-white'></div>
      </div>
      <div className='relative w-[500px] h-[102px] border-s-orange-100 border-1 overflow-hidden'>
        <div className={styles.animated}></div>
        <div className={styles.animated + ' ' + styles.animated1}></div>
        <div className={styles.animated + ' ' + styles.animated2}></div>
        <div className={styles.animated + ' ' + styles.animated3}></div>
        <div className={styles.animated + ' ' + styles.animated4}></div>
      </div>
      <div onClick={() => setCount(count + 1)}>++</div>
      <CMP1 />
      <CMP2 />
      <CMP3 count={count} />
      <GenericCmp<Person>
        data={persons}
        render={(item) => (
          <div key={item.name}>
            {item.name} -- {item.age} -- {item.gender}
          </div>
        )}
      />
      <Link href='/test1'>go test 1 </Link>
      <input type='text' name='num' id='num' value={num} onChange={onChange} />
      <span className='ms-5 mt-3 h3'>100,000 multiples of number: {num}</span>
      <div className='multiples row mt-5'>{isPending ? 'Loading...' : multiples}</div>
      <div className='multiples row mt-5'>{multiples}</div>
    </div>
  );
};
