/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-11 15:01:53
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-14 00:56:16
 * @FilePath: /nextjs/travel-dairy/src/app/test1/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState, useTransition } from 'react';

const Page = () => {
  const [num, setNum] = useState(0);
  const [multiples, setMultiples] = useState([] as JSX.Element[]);

  const [isPending, startTransition] = useTransition();

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
      page222--- {randomNumber()}
      <Link href='/test1'>go test 1</Link>
      <input type='text' name='num' id='num' value={num} onChange={onChange} />
      <span className='ms-5 mt-3 h3'>100,000 multiples of number: {num}</span>
      <div className='multiples row mt-5'>{isPending ? 'Loading...' : multiples}</div>
      <div className='multiples row mt-5'>{multiples}</div>
    </div>
  );
};

export default Page;
