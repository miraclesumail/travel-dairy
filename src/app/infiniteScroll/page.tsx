/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-01-19 00:18:27
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-11-05 23:05:53
 * @FilePath: /travel-dairy/src/app/infiniteScroll/demo.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import React, { useEffect, useRef, useState, CSSProperties, Fragment } from 'react';
import './style.scss';

const data = Array.from({ length: 100 }, (_, index) => index);

const listHeight = data.length * 80;

type Props<T> = {
  lineHeight: number;
  data: T[];
  containerStyle?: CSSProperties;
  renderer: (item: T) => React.ReactElement;
};

export function Infinite<T>(props: Props<T>) {
  const { lineHeight, data, containerStyle = {}, renderer } = props;

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [offset, setOffset] = useState(0);
  const listRef = useRef<any>(null);
  const listHeight = data.length * lineHeight;

  const visibleData = data.slice(start, Math.min(end, data.length));

  // 生命周期钩子
  useEffect(() => {
    setEnd(start + Math.ceil(listRef.current.clientHeight / lineHeight) + 1);
  }, []);

  const onScroll = () => {
    const scrollTop = listRef.current.scrollTop; // 当前滚动距离
    setStart(Math.floor(scrollTop / lineHeight));
    setEnd(Math.floor(scrollTop / lineHeight) + Math.ceil(listRef.current.clientHeight / lineHeight) + 1);
    setOffset(scrollTop - (scrollTop % lineHeight));
  };

  return (
    <div className='infinite-container' ref={listRef} onScroll={onScroll} style={containerStyle}>
      <div className='infinite-list-phantom' style={{ height: listHeight + 'px' }}></div>
      <div className='infinite-list' style={{ transform: `translateY(${offset}px)` }}>
        {visibleData.map((item, index) => (
          <Fragment key={index}>{renderer(item)}</Fragment>
        ))}
      </div>
    </div>
  );
}

const Demo = () => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [offset, setOffset] = useState(0);
  const listRef = useRef<any>(null);

  const visibleData = data.slice(start, Math.min(end, data.length));

  // 生命周期钩子
  useEffect(() => {
    setEnd(start + Math.ceil(listRef.current.clientHeight / 80));
  }, []);

  const onScroll = () => {
    const scrollTop = listRef.current.scrollTop; // 当前滚动距离
    setStart(Math.floor(scrollTop / 80));
    setEnd(Math.floor(scrollTop / 80) + Math.ceil(listRef.current.clientHeight / 80));
    setOffset(scrollTop - (scrollTop % 80));
  };

  return (
    <div className='infinite-container' ref={listRef} onScroll={onScroll}>
      <div className='infinite-list-phantom' style={{ height: listHeight + 'px' }}></div>

      <div className='infinite-list' style={{ transform: `translateY(${offset}px)` }}>
        {visibleData.map((item) => (
          <div className='infinite-item' key={item} style={{ height: '80px', lineHeight: '80px' }}>
            {item + 1} content {start}--{end}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Demo;
