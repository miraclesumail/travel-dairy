/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-03 13:51:25
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-07-04 14:18:39
 * @FilePath: /nextjs/travel-dairy/src/app/products/[productId]/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import type { Metadata } from "next";
import { ImageResponse } from 'next/og'

type Props = {
  params: { productId: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.productId;

  return {
    title: `this is ${id} product page`,
    icons: '/youtube_32x32.png'
  };
}

export default function Page({ params }: { params: { productId: number } }) {
  if (params.productId > 10) throw new Error('id is too big')
  
  return <div>My Product: {params.productId}</div>;
}
