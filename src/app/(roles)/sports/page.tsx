'use client';
import { redirect } from 'next/navigation';
import useTheme from '@/hooks/useTheme';

/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-28 20:35:45
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-28 20:36:05
 * @FilePath: /travel-dairy/src/app/(roles)/sports/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const Page = () => {
  const theme = useTheme();

  if (theme !== 'kok') {
    return redirect('/login');
  }

  return <div>sports {theme}</div>;
};

export default Page;
