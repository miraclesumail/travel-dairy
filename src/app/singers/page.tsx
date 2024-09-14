/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-07 22:48:06
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-08-09 01:18:02
 * @FilePath: /nextjs/travel-dairy/src/app/singers/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";

import { useEffect, useState } from "react";

const Page = () => {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await (await fetch("/api/getSingers")).json();
        console.log(data.list);
        setList(data.list);
      } catch (error) {
        console.log(error);
        throw error;
      }
    })();
  }, []);

  return (
    <div>
      singers
      {list.length > 0 ? list[0].name : ""}
    </div>
  );
};

export default Page;
