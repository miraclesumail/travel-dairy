/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-11-29 19:38:01
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-12-02 00:59:16
 * @FilePath: /travel-dairy/src/app/frame-motion/trend.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { divide, orderBy } from 'lodash';
import { drawSolidRect } from '../utils';
import ToolTip from './tooltip';

const mock = [
  { start: 2000, end: 2300, high: 2400, low: 1950 },
  { start: 2300, end: 2600, high: 2660, low: 2200 },
  { start: 2600, end: 2800, high: 2880, low: 2520 },
  { start: 2800, end: 2500, high: 2800, low: 2400 },
  { start: 2500, end: 2900, high: 3000, low: 2300 },
];

const Trend = () => {
  const [data, setData] = useState(mock);
  const timeRef = useRef<ReturnType<typeof setInterval>>();
  const numRef = useRef<number>(1);
  const data1 = orderBy(data, ['low'], 'asc');
  const data2 = orderBy(data, ['high'], 'desc');
  const yGap = data2[0].high - data1[0].low;

  const perUnit = (600 - 50) / yGap;

  useEffect(() => {
    timeRef.current = setInterval(() => {
      increaseLast(numRef.current++);
    }, 500000);

    return () => {
      clearInterval(timeRef.current);
    };
  }, []);

  function increaseLast(delta: number) {
    console.log(delta, 'delta');
    setData((data: any[]) => {
      const tempData = [...data];

      tempData[tempData.length - 1] = {
        ...tempData[tempData.length - 1],
        end: tempData[tempData.length - 1].end + delta,
      };
      return tempData;
    });
  }

  console.log(data);

  return (
    <div className='w-[600px] h-[600px] mx-auto bg-slate-300 relative'>
      {data.map((item, index) => (
        // <ToolTip
        //   classname='relative'
        //   conetnt={
        //     <div className='flex flex-col rounded bg-blue-300 '>
        //       <span>开盘: {item.start}</span>
        //       <span>最高: {item.high}</span>
        //       <span>最低: {item.low}</span>
        //       <span>收盘: {item.end}</span>
        //       <span>涨跌额: {item.end - item.start}</span>
        //       <span>成交额: 1.21万</span>
        //     </div>
        //   }
        // >
        <Item
          key={index}
          width={18}
          height={perUnit * (item.high - item.low)}
          fill={item.end > item.start ? 'green' : 'red'}
          left={10 * (index + 1) + index * 18}
          top={50 + (data2[0].high - item.high) * perUnit}
          {...item}
        />
      ))}
      {/* <Item
        width={18}
        height={perUnit * (data[0].high - data[0].low)}
        fill='green'
        left={10}
        top={50 + (data2[0].high - data[0].high) * perUnit}
        {...data[0]}
      />
      */}
    </div>
  );
};

type ItemProps = {
  width: number;
  height: number;
  fill: string;
  start: number;
  end: number;
  low: number;
  high: number;
  left: number;
  top: number;
};

const Item = ({ width, height, fill, start, end, low, high, left, top }: ItemProps) => {
  const zhibiao = { start, end, low, high };
  const dpr = window.devicePixelRatio;

  const canvasRef: MutableRefObject<any> = useRef<HTMLCanvasElement>();

  console.log('render');

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.style.left = left + 'px';
    canvas.style.top = top + 'px';
    canvas.style.background = 'transparent';

    const ctx = canvas.getContext('2d');
    ctx?.scale(dpr, dpr);

    const startY = end > start ? ((high - end) / (high - low)) * height : ((high - start) / (high - low)) * height;

    drawSolidRect(ctx as CanvasRenderingContext2D, {
      x: 0,
      y: startY,
      width,
      height: (Math.abs(end - start) / (high - low)) * height,
      fillStyle: fill,
    });
    drawSolidRect(ctx as CanvasRenderingContext2D, {
      x: width / 2 - 0.5,
      y: 0,
      width: 1,
      height,
      fillStyle: fill,
    });

    return () => ctx?.clearRect(0, 0, width, width);
  }, [zhibiao]);

  return <canvas className='canvas absolute' ref={canvasRef}></canvas>;
};

export default Trend;
