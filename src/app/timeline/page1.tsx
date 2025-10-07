/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-06 00:41:02
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-06 02:25:12
 * @FilePath: /travel-dairy/src/app/timeline/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';

import React from 'react';
import { Timeline } from './demo';
import { TimelineItemData } from './types';

const data: TimelineItemData[] = [
  {
    id: 1,
    title: '项目启动',
    date: '2025-01-10',
    subtitle: '需求确认 & 计划',
    description: '完成需求讨论，确定 MVP 和主要里程碑。',
    color: 'bg-green-500',
    // icon: <StarIcon /> // 如果有svg可以传
  },
  {
    id: 2,
    title: '设计阶段',
    date: '2025-02-04',
    subtitle: 'UI / UX',
    description: '完成高保真设计，交互验收并输出设计文档。',
    color: 'bg-indigo-500',
  },
  {
    id: 3,
    title: '开发阶段',
    date: '2025-03-20',
    subtitle: '前后端联调',
    description: '实现核心功能、接口联调及单元测试。',
    color: 'bg-blue-500',
  },
  {
    id: 4,
    title: '上线',
    date: '2025-05-01',
    subtitle: '灰度 + 全量',
    description: '灰度发布与监控，确认稳定后全量上线。',
    color: 'bg-red-500',
  },
];

export default function App() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
      <h1 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>时间轴示例</h1>

      <section className='mb-10'>
        <h2 className='text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200'>纵向时间轴（默认）</h2>
        <div className='max-w-2xl'>
          <Timeline items={data} orientation='vertical' />
        </div>
      </section>

      <section>
        <h2 className='text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200'>横向时间轴（滚动）</h2>
        <Timeline items={data} orientation='horizontal' />
      </section>
    </div>
  );
}
