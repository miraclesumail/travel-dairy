/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-11-19 19:37:43
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-11-19 20:25:20
 * @FilePath: /travel-dairy/src/app/swiperTab/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";
import { SwipeTabs } from '@/components/my/swipeTabs';

const tabs = [
  { label: 'Tab 1', content: <div className='p-4'>这是 Tab 1 内容</div> },
  { label: 'Tab 2', content: <div className='p-4'>这是 Tab 2 内容</div> },
  { label: 'Tab 3', content: <div className='p-4'>这是 Tab 3 内容</div> },
];

export default function App() {
  return (
    <div className='h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md bg-white rounded-lg shadow'>
        <SwipeTabs tabs={tabs} thresholdNum={0.4}/>
      </div>
    </div>
  );
}
