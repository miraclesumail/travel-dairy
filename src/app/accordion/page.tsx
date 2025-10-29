/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-13 18:08:49
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-28 20:22:15
 * @FilePath: /travel-dairy/src/app/accordion/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEm
 */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Accordion, { type AccordionProps, type AccordionItemProps } from './accordion';
import Demo from '@theme/demo';

import './style.scss';

const dataList: Partial<AccordionItemProps>[] = [
  {
    title: '面板一：简介',
    open: true,
    children: (
      <>
        <Demo />
        <p>这里是面板一的内容。</p>
        <p>支持多行文字，展开高度自动适应。</p>
      </>
    ),
  },
  {
    title: '面板二：更多信息',
    open: false,
    children: (
      <>
        <p>这里是面板一的内容222。</p>
        <p>支持多行文字，展开高度自动适应222。</p>
      </>
    ),
  },
  {
    title: '面板三：常见问题',
    open: false,
    children: (
      <>
        <p>这里是面板一的内容333。</p>
        <p>支持多行文字，展开高度自动适应333。</p>
        <p>支持多行文字，展开高度自动适应333。</p>
        <p>支持多行文字，展开高度自动适应333。</p>
      </>
    ),
  },
];

function randomString(e: any) {
  e = e || 32;
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    a = t.length,
    n = '';
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

const Page = () => {
  const [list, setList] = useState<AccordionItemProps[]>(
    dataList.map((item, index) => ({
      ...item,
      index,
      id: `accordion_${randomString(10)}_${index}`,
    })) as any[]
  );

  const router = useRouter();

  function onItemClick(index: number) {
    console.log('onItemClick', list);

    const temp = [...list];
    temp[index] = {
      ...temp[index],
      open: !temp[index].open,
    };
    router.push('/demo');
    setList(temp);
  }

  return (
    <Accordion
      dataList={list.map((item) => ({
        ...item,
        onItemClick,
      }))}
    />
  );
};

export default Page;
