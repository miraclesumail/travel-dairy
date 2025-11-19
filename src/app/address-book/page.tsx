'use client';
import { Lunar, Solar } from 'lunar-typescript';
import throttle from 'lodash/throttle';
import './style.scss';
import { useEffect, useRef, UIEvent, useState } from 'react';
import { verticalDistanceExcludingParentPaddingMargin } from '@/app/utils/dom';

const titleArrs = ['四季如春', '三阳开泰', '五福临门', '一帆风顺', '八仙过海'];

export default function Page() {
  const [title, setTitle] = useState('');
  const topArrs = useRef<number[]>([]);

  useEffect(() => {
    const parent = document.querySelector('.contacts-list') as HTMLDivElement;
    const divs: HTMLDivElement[] = Array.from(document.querySelectorAll('.contacts-group'));

    for (const div of divs) {
      console.log(div);
      topArrs.current.push(verticalDistanceExcludingParentPaddingMargin(div, parent));
    }

    console.log(topArrs, 'topArrstopArrs');

    const scrollFunc = throttle(onScroll);
    scrollFunc({ target: parent } as any);

    parent.addEventListener('scroll', scrollFunc, false);

    return () => parent.removeEventListener('scroll', scrollFunc);
  }, []);

  function onScroll(e: Event) {
    const scrollTop = (e.target as HTMLDivElement).scrollTop;

    topArrs.current.forEach((toParentTop, index) => {
      if (toParentTop - scrollTop < 37) {
        setTitle(titleArrs[index]);
      }
    });
  }

  function locateMenu(index: number) {
    const parent = document.querySelector('.contacts-list') as HTMLDivElement;
    parent.scroll(0, topArrs.current[index]);
  }

  console.log(Lunar.fromDate(new Date('2024-10-11')).getYearShengXiao());
  console.log(Lunar.fromDate(new Date('2025-04-04')).getJieQi());
  console.log(Lunar.fromDate(new Date('2025-05-31')).getFestivals());
  console.log(Lunar.fromDate(new Date()).getDayInChinese());
  console.log(Lunar.fromDate(new Date()).getMonthInChinese());
  console.log(Lunar.fromDate(new Date()).getYearInGanZhi() + '' + Lunar.fromDate(new Date()).getYearShengXiao() + '年');

  return (
    <div className='flex'>
      <div className='w-[200px]'>
        {titleArrs.map((tt, index) => (
          <div
            className={`h-[30px] leading-[30px] bg-slate-400 text-center ${tt == title ? 'bg-pink-400' : ''}`}
            key={index}
            onClick={() => locateMenu(index)}
          >
            {tt}
          </div>
        ))}
      </div>
      <div className='flex-1 contacts-list'>
        <section className='contacts-group'>
          <h2 className='group-header'>四季如春</h2>
          <ul className='contact-items'>
            <li className='contact-item'>
              <FoodWrap />
            </li>
            <li className='contact-item'>
              <FoodWrap />
            </li>
            <li className='contact-item'>
              <FoodWrap />
            </li>
            <li className='contact-item'>
              <FoodWrap />
            </li>
            <li className='contact-item'>
              <FoodWrap />
            </li>
            <li className='contact-item'>
              <FoodWrap />
            </li>
            <li className='contact-item'>
              <FoodWrap />
            </li>
            <li className='contact-item'>
              <FoodWrap />
            </li>
          </ul>
        </section>

        <section className='contacts-group'>
          <h2 className='group-header'>三阳开泰</h2>
          <ul className='contact-items'>
            <li className='contact-item'>Bob</li>
            <li className='contact-item'>Betty</li>
            <li className='contact-item'>Betty1</li>
            <li className='contact-item'>Betty33</li>
            <li className='contact-item'>Betty55</li>
            <li className='contact-item'>Betty88</li>
            <li className='contact-item'>Betty88</li>
            <li className='contact-item'>Betty88</li>
            <li className='contact-item'>Betty88</li>
          </ul>
        </section>

        <section className='contacts-group'>
          <h2 className='group-header'>五福临门</h2>
          <ul className='contact-items'>
            <li className='contact-item'>Charlie1</li>
            <li className='contact-item'>Charlie</li>
            <li className='contact-item'>Charlie</li>
            <li className='contact-item'>Charlie</li>
            <li className='contact-item'>Charlie2</li>
            <li className='contact-item'>Charlie</li>
            <li className='contact-item'>Charlie</li>
            <li className='contact-item'>Charlie</li>
            <li className='contact-item'>Charlie</li>
          </ul>
        </section>

        <section className='contacts-group'>
          <h2 className='group-header'>一帆风顺</h2>
          <ul className='contact-items'>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
          </ul>
        </section>
        <section className='contacts-group'>
          <h2 className='group-header'>八仙过海</h2>
          <ul className='contact-items'>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
            <li className='contact-item'>Dharlie1</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

const FoodWrap = () => {
  return (
    <div className='flex gap-3'>
      <div className='w-[100px] h-[120px] rounded-[8px] border-[1px] border-orange-50'></div>
      <div className='flex flex-col'>
        <span>小炒肉</span>
        <span>月售18</span>
        <div className='mt-auto flex w-[100px] justify-between'>
          <span>￥15</span>
          <div className='w-[18px] h-[18px] rounded-[9px] text-center leading-[18px] bg-yellow-500'>+</div>
        </div>
      </div>
    </div>
  );
};
