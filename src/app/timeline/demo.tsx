/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-06 00:40:51
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-06 00:40:55
 * @FilePath: /travel-dairy/src/app/timeline/demo.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { TimelineItemData, TimelineOrientation } from './types';
import { TimelineItem } from './TimelineItem';

interface Props {
  items: TimelineItemData[];
  orientation?: TimelineOrientation;
  className?: string;
  compact?: boolean;
}

export const Timeline: React.FC<Props> = ({
  items,
  orientation = 'vertical',
  className = '',
  compact = false,
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`relative ${className}`} role="list" aria-orientation="vertical">
        {items.map((it, idx) => (
          <TimelineItem key={it.id} item={it} orientation="vertical" isLast={idx === items.length - 1} />
        ))}
      </div>
    );
  }

  // horizontal layout
  return (
    <div className={`w-full overflow-auto ${className}`}>
      <div className="flex gap-8 items-start" role="list" aria-orientation="horizontal">
        {items.map((it, idx) => (
          <div key={it.id} className={`${compact ? 'min-w-[180px]' : 'min-w-[240px]'}`}>
            <TimelineItem item={it} orientation="horizontal" isLast={idx === items.length - 1} />
          </div>
        ))}
      </div>
    </div>
  );
};