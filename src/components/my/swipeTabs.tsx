/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-11-19 17:37:23
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-11-19 20:25:53
 * @FilePath: /travel-dairy/src/components/my/swipeTabs.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useRef, useCallback, TouchEventHandler, useEffect } from 'react';

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface SwipeTabsProps {
  tabs: TabItem[];
  initialIndex?: number;
  thresholdNum?: number;
}

export const SwipeTabs: React.FC<SwipeTabsProps> = ({ tabs, initialIndex = 1, thresholdNum = 0.5 }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // 拖动相关
  const [dragX, setDragX] = useState(0); // 当前拖动偏移量（px）
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);
  const dragRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // 区分是触摸还是鼠标，方便在 mouseleave 等情况处理
  const isMouseDraggingRef = useRef(false);

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  React.useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  useEffect(() => {
    dragRef.current = dragX;
  }, [dragX]);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    setDragX(0);
  };

  // ================== 触摸事件 ==================
  const handleTouchStart: TouchEventHandler<HTMLDivElement> = (e) => {
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    setIsDragging(true);
    isMouseDraggingRef.current = false;
  };

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging || startXRef.current === null) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startXRef.current;

    applyDeltaXWithBoundary(deltaX);
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (!isDragging) return;
    finishSwipe();
  };

  // ================== 鼠标事件（PC） ==================
  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    // 只响应左键
    if (e.button !== 0) return;
    e.preventDefault();

    startXRef.current = e.clientX;
    setIsDragging(true);
    isMouseDraggingRef.current = true;

    // 在 window 上监听，防止鼠标移出容器丢失事件
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
  };

  const handleWindowMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isMouseDraggingRef.current || startXRef.current === null) return;
    const deltaX = e.clientX - startXRef.current;
    applyDeltaXWithBoundary(deltaX);
  };

  const handleWindowMouseUp = () => {
    if (!isDragging || !isMouseDraggingRef.current) return;
    finishSwipe();
  };

  // ================== 通用逻辑 ==================

  // 应用 deltaX，并加上边界限制
  const applyDeltaXWithBoundary = (deltaX: number) => {
    // 边界限制：第一个 tab 不允许继续向右拖；最后一个不允许继续向左拖
    if ((activeIndex === 0 && deltaX > 0) || (activeIndex === tabs.length - 1 && deltaX < 0)) {
      setDragX(deltaX / 3); // 边缘区域阻尼
      return;
    }
    setDragX(deltaX);
  };

  // 结束滑动（触摸结束 / 鼠标抬起）
  const finishSwipe = () => {
    setIsDragging(false);
    const moveX = (isMouseDraggingRef.current ? dragRef.current : dragX) || 0;
    isMouseDraggingRef.current = false;

    if (!containerWidth) {
      setDragX(0);
      return;
    }

    const threshold = containerWidth * thresholdNum; // 50% 阈值

    if (moveX < -threshold && activeIndex < tabs.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (moveX > threshold && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }

    setDragX(0);

    // 清理 window 监听
    window.removeEventListener('mousemove', handleWindowMouseMove);
    window.removeEventListener('mouseup', handleWindowMouseUp);
  };

  useEffect(() => {
    // 组件卸载时清理 window 事件
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, []);

  // 当前激活 Tab 的基础偏移（百分比）
  const baseTranslateX = -activeIndex * 100;
  // 将 dragX 像素转换为百分比
  const dragPercent = containerWidth ? (dragX / containerWidth) * 100 : 0;
  const totalTranslateX = baseTranslateX + dragPercent;

  return (
    <div className='flex flex-col w-full'>
      {/* Tab 标题行 */}
      <div className='flex border-b border-gray-200 select-none'>
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            className={`flex-1 py-2 text-center text-sm font-medium transition
              ${
                index === activeIndex
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 border-b-2 border-transparent'
              }`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        ref={containerRef}
        className='relative overflow-hidden touch-pan-y select-none'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`
            flex w-full
            ${isDragging ? '' : 'transition-transform duration-300 ease-out'}
          `}
          style={{
            transform: `translateX(${totalTranslateX}%)`,
          }}
        >
          {tabs.map((tab) => (
            <div key={tab.label} className='w-full flex-shrink-0'>
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
