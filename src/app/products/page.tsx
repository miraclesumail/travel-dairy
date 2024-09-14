/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-03 13:49:52
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-07-05 00:10:33
 * @FilePath: /nextjs/travel-dairy/src/app/products/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Suspense, useEffect } from "react";
import { Demo1, Demo2 } from "./test";

const delay = (time: number) => new Promise((resolve) => setTimeout(() => resolve(1), time * 1000));

const getData = async () => {
  await delay(3);
  return {
    data: "hhhh",
  };
};

export default async function Produts() {
  const data = await getData();

  return (
    <div>
      this is products page {data.data}
      <Suspense fallback={<div>loading demo1</div>}>
        <Demo1 />
      </Suspense>
      <Suspense fallback={<div>loading demo2</div>}>
        <Demo2 />
      </Suspense>
    </div>
  );
}
