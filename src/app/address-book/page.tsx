'use client';
import { Lunar, Solar } from 'lunar-typescript';
import './style.scss';

export default function Page() {
  console.log(Lunar.fromDate(new Date('2024-10-11')).getYearShengXiao());
  console.log(Lunar.fromDate(new Date('2025-04-04')).getJieQi());
  console.log(Lunar.fromDate(new Date('2025-05-31')).getFestivals());
  console.log(Lunar.fromDate(new Date()).getDayInChinese());
  console.log(Lunar.fromDate(new Date()).getMonthInChinese());
  console.log(Lunar.fromDate(new Date()).getYearInGanZhi() + '' + Lunar.fromDate(new Date()).getYearShengXiao() + '年');

  return (
    <div className='contacts-list'>
      <section className='contacts-group'>
        <h2 className='group-header'>A</h2>
        <ul className='contact-items'>
          <li className='contact-item'>Alice</li>
          <li className='contact-item'>Anna</li>
          <li className='contact-item'>Anna11</li>
          <li className='contact-item'>Anna222</li>
        </ul>
      </section>

      <section className='contacts-group'>
        <h2 className='group-header'>B</h2>
        <ul className='contact-items'>
          <li className='contact-item'>Bob</li>
          <li className='contact-item'>Betty</li>
          <li className='contact-item'>Betty1</li>
          <li className='contact-item'>Betty33</li>
          <li className='contact-item'>Betty55</li>
          <li className='contact-item'>Betty88</li>
        </ul>
      </section>

      <section className='contacts-group'>
        <h2 className='group-header'>C</h2>
        <ul className='contact-items'>
          <li className='contact-item'>Charlie1</li>
          <li className='contact-item'>Charlie</li>
          <li className='contact-item'>Charlie</li>
          <li className='contact-item'>Charlie</li>
          <li className='contact-item'>Charlie2</li>
          <li className='contact-item'>Charlie</li>
        </ul>
      </section>

      <section className='contacts-group'>
        <h2 className='group-header'>D</h2>
        <ul className='contact-items'>
          <li className='contact-item'>Dharlie1</li>
          <li className='contact-item'>Dharlie1</li>
          <li className='contact-item'>Dharlie1</li>
          <li className='contact-item'>Dharlie1</li>
          <li className='contact-item'>Dharlie1</li>
          <li className='contact-item'>Dharlie1</li>
        </ul>
      </section>
    </div>
  );
}
