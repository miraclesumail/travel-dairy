'use client';
import { Lunar, Solar } from 'lunar-typescript';
import dayjs from 'dayjs';
import { Infinite } from '../infiniteScroll/page';
import './style.scss';
import { MutableRefObject, UIEventHandler, useEffect, useRef, useState } from 'react';

const headerTitle = ['日', '一', '二', '三', '四', '五', '六'];

function getDateFromDayOfYear(year: number, day: number) {
  if (typeof year !== 'number' || typeof day !== 'number' || day <= 0) {
    console.error('请输入有效的年份和大于0的天数。');
    return null;
  }

  // 创建一个表示该年份1月1日的Date对象
  // 注意：JavaScript的月份是从0开始的，所以1月是0
  const date = new Date(year, 0, 1);

  // 使用setDate()方法设置天数。
  // 因为是从1月1日（第1天）开始计算，所以需要减去1
  date.setDate(day);

  // 获取年份、月份和日期
  const yyyy = date.getFullYear();
  // 月份需要加1，并且用padStart补齐两位
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  // 日期需要用padStart补齐两位
  const dd = String(date.getDate()).padStart(2, '0');

  // 组合成 'YYYY-MM-DD' 格式的字符串
  return `${yyyy}-${mm}-${dd}`;
}

const DELTA_Y = 80;

export default function Page() {
  const [count, setCount] = useState(4);
  //   const [dateList] = useState(generateDateList(196));
  const [headTitle, setHeadTitle] = useState('');
  const lock = useRef(false);
  const scrollRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  const dateList = generateDateList1(42 * 8);
  console.log(Solar.fromDate(new Date()).getMonth(), 'monththth');
  console.log(dayjs().startOf('month').format('YYYY-MM-DD'));
  console.log(dayjs().startOf('month').subtract(-2, 'day').format('YYYY-MM-DD'));
  console.log(dayjs(new Date('2025-10-26')).get('day'));
  console.log(dayjs(new Date('2025-09-26')).startOf('month').get('day'));

  console.log(generateDateList1(42 * 8), 'generateDateList1generateDateList1');

  function showHeaderTitle(scrollTop: number) {
    const firstDateList = dateList.filter(isFirstDayOfMonth);
    const toTops = [];
    for (const date of firstDateList) {
      const offsetTop = (document.querySelector(`#date-cell-${date}`) as HTMLElement).offsetTop;
      const toTop = Math.abs(offsetTop - scrollTop);
      toTops.push(toTop);
    }

    const minTop = Math.min(...toTops);
    const index = toTops.lastIndexOf(minTop);
    return dayjs(new Date(firstDateList[index])).format('YYYY-MM');
  }

  /**
   * 生成日期数据列表
   * @param count how many days want to get
   * @returns an array of date string ['2025-10-10', '2025-10-11', ...]
   */
  function generateDateList(count: number): string[] {
    const startDayOfCurrentMonth = dayjs().startOf('month').get('day');
    return Array.from({ length: count }, (_, index) =>
      dayjs()
        .startOf('month')
        .subtract(startDayOfCurrentMonth - index, 'day')
        .format('YYYY-MM-DD')
    );
  }

  function generateDateList1(count: number): any[] {
    const startDayOfCurrentMonth = dayjs().startOf('month').get('day');
    const data = Array.from({ length: count }, (_, index) =>
      dayjs()
        .startOf('month')
        .subtract(startDayOfCurrentMonth - index, 'day')
        .format('YYYY-MM-DD')
    );

    const data1 = data.map((date) => dayjs(date).subtract(count, 'day').format('YYYY-MM-DD'));

    const total = [...data1, ...data];
    console.log(data1, 'hhhh');

    return Array.from({ length: count*2 / 7 }).map((_, index) => total.slice(index * 7, (index + 1) * 7));
  }

  function isFirstDayOfMonth(date: string): boolean {
    return dayjs(new Date(date)).startOf('month').format('YYYY-MM-DD') == dayjs(new Date(date)).format('YYYY-MM-DD');
  }

  function isWeekend(date: string): boolean {
    return [0, 6].includes(dayjs(new Date(date)).get('day'));
  }

  function formatContent(date: string) {
    const day = Solar.fromDate(new Date(date)).getDay();
    const month = Solar.fromDate(new Date(date)).getMonth();

    return [
      Lunar.fromDate(new Date(date)).getDayInChinese(),
      `${day == 1 ? `${month}月` : ''}${day}日`,
      Lunar.fromDate(new Date(date)).getJieQi(),
      Lunar.fromDate(new Date(date)).getFestivals(),
    ];
  }

  function renderer(data: any[]) {
    return (
      <div className='content relative'>
        {data.map((date, index) => (
          <div
            key={index}
            className={`date-cell ${isWeekend(date) ? 'bg-[#f5f5f5] text-[#c3c3c3]' : ''}`}
            id={`date-cell-${date}`}
          >
            <div className='w-full flex justify-between px-1'>
              <span>{formatContent(date)[0]}</span>
              <span>{formatContent(date)[1]}</span>
            </div>
            {formatContent(date)[2] ? (
              <div className='mt-1 w-[90%] mx-auto bg-[#F3DFFA] text-center text-[#09090b]'>
                {formatContent(date)[2]}
              </div>
            ) : null}

            {formatContent(date)[3].length ? (
              <div className='mt-1 w-[90%] mx-auto bg-[#F3DFFA] text-center text-[#09090b]'>
                {formatContent(date)[3][0]}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  function getText(index: number) {
    const start = Lunar.fromDate(new Date('2025-01-01')).getWeek();
    if (index >= start) {
      const date = getDateFromDayOfYear(2025, index - start + 1);
      const day = Solar.fromDate(new Date(date!)).getDay();
      const month = Solar.fromDate(new Date(date!)).getMonth();
      return `${Lunar.fromDate(new Date(date!)).getDayInChinese()}  ${day == 1 ? `${month}月` : ''}${day}日`;
    }

    return '';
  }

  return (
    <div className='container'>
      <div>
        {headTitle} {count}
      </div>
      <header>
        {headerTitle.map((title, index) => (
          <div key={index}>{title}</div>
        ))}
      </header>

      <Infinite<string[]>
        data={dateList}
        lineHeight={80}
        renderer={renderer}
        containerStyle={{ height: '480px', overflow: 'auto', position: 'relative' }}
      />
      {/* <section ref={scrollRef}>
        <div className='content relative'>
          {dateList.map((date, index) => (
            <div
              key={index}
              className={`date-cell ${isWeekend(date) ? 'bg-[#f5f5f5] text-[#c3c3c3]' : ''}`}
              id={`date-cell-${date}`}
            >
              <div className='w-full flex justify-between px-1'>
                <span>{formatContent(date)[0]}</span>
                <span>{formatContent(date)[1]}</span>
              </div>
              {formatContent(date)[2] ? (
                <div className='mt-1 w-[90%] mx-auto bg-[#F3DFFA] text-center text-[#09090b]'>
                  {formatContent(date)[2]}
                </div>
              ) : null}

              {formatContent(date)[3].length ? (
                <div className='mt-1 w-[90%] mx-auto bg-[#F3DFFA] text-center text-[#09090b]'>
                  {formatContent(date)[3][0]}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
}
