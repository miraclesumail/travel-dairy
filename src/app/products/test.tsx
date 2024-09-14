/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-05 00:09:36
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-07-05 00:14:24
 * @FilePath: /nextjs/travel-dairy/src/app/products/test.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { useEffect } from "react";

const delay = (time: number) => new Promise((resolve) => setTimeout(() => resolve(1), time * 1000));

const getDemoData = async (second: number) => {
  await delay(second);
  const data = await fetch("/api");
  return data.json();
};

export const Demo1 = () => {
  useEffect(() => {
    (async () => {
      const data = await getDemoData(2);

    })();
  }, []);

  return <div>111</div>;
};

export const Demo2 = () => {
  useEffect(() => {
    (async () => {
        const data = await getDemoData(5);
    })();
  }, []);

  return <div>222</div>;
};
