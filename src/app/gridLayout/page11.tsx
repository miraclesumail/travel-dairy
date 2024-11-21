/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-11-03 23:21:16
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-11-04 01:27:41
 * @FilePath: /travel-dairy/src/app/gridLayout/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEm
 */
'use client';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import _ from 'lodash';
import { useEffect, useState } from 'react';

const ReactGridLayout = WidthProvider(RGL);

const ITEMS = 20;

const defaultProps = {
  className: 'layout',
  rowHeight: 30,
  onLayoutChange: function () {},
  cols: 12,
};

// const defaultLayout: Layout[] = [
//   {
//     x: 0,
//     y: 0,
//     w: 4,
//     h: 1,
//     i: '0',
//   },
//   {
//     x: 4,
//     y: 0,
//     w: 4,
//     h: 2,
//     i: '1',
//   },
//   {
//     x: 8,
//     y: 0,
//     w: 4,
//     h: 4,
//     i: '2',
//   },
//   {
//     x: 2,
//     y: 1,
//     w: 2,
//     h: 2,
//     i: '3',
//   },
// ];

export default function Page() {
  const [layout, setLayout] = useState<Layout[]>([]);

  useEffect(() => {
    const ll = generateLayout();
    console.log(ll, '----000');
    setLayout(ll);
  }, []);

  function stringifyLayout() {
    return layout.map(function (l) {
      const name = l.i === '__dropping-elem__' ? 'drop' : l.i;
      return (
        <div className='layoutItem' key={l.i}>
          <b>{name}</b>
          {`: [${l.x}, ${l.y}, ${l.w}, ${l.h}]`}
        </div>
      );
    });
  }

  function generateDOM() {
    return _.map(_.range(ITEMS), function (i) {
      return (
        <div key={i} className='bg-cyan-200'>
          <span className='text'>{i}</span>
        </div>
      );
    });
  }

  function generateLayout() {
    return _.map(new Array(ITEMS), function (item, i) {
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString(),
      };
    });
  }

  return (
    <>
      <div className='flex flex-row flex-wrap gap-10'>{stringifyLayout()}</div>
      {/* <ReactGridLayout layout={layout} {...defaultProps}>
        {generateDOM()}
      </ReactGridLayout> */}
    </>
  );
}
