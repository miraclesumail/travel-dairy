/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-06 00:38:44
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-06 00:40:42
 * @FilePath: /travel-dairy/src/app/timeline/Timeline.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-06 00:38:44
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-06 00:39:07
 * @FilePath: /travel-dairy/src/app/timeline/Timeline.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { TimelineItemData } from './types';

interface Props { 
  item: TimelineItemData;
  orientation: 'vertical' | 'horizontal';
  isLast?: boolean;
}

export const TimelineItem: React.FC<Props> = ({ item, orientation, isLast }) => {
  return (
    <div
      className={
        orientation === 'vertical'
          ? 'relative pl-8 pb-8 last:pb-0'
          : 'flex flex-col items-start space-x-4'
      }
      role="listitem"
    >
      {/* Dot + line */}
      <div
        className={
          orientation === 'vertical'
            ? 'absolute left-0 top-1 w-6 flex items-center justify-center'
            : 'flex items-center mb-2'
        }
      >
        <div
          className={`flex items-center justify-center w-5 h-5 rounded-full ring-2 ring-white ${item.color ?? 'bg-blue-500'}`}
          aria-hidden
        >
          {item.icon ?? <span className="text-white text-xs font-bold">•</span>}
        </div>
        {/* vertical line */}
        {orientation === 'vertical' && !isLast && (
          <div className="absolute left-2 top-7 h-[calc(100%-28px)] w-0.5 bg-gray-300 dark:bg-gray-700" aria-hidden />
        )}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-3 border border-gray-100 dark:border-gray-700">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
          {item.date && <time className="text-xs text-gray-500 dark:text-gray-400">{item.date}</time>}
        </div>
        {item.subtitle && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.subtitle}</div>}
        {item.description && <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{item.description}</p>}
      </div>
    </div>
  );
};