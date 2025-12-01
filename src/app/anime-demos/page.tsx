/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-11-25 19:08:06
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-12-01 21:06:05
 * @FilePath: /travel-dairy/src/app/anime-demos/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import { animate } from 'animejs';
import { stagger, set } from 'animejs';
import { createTimeline } from 'animejs';
import { useEffect } from 'react';
import Animatable from './animatable'

const onComplete = ({ targets }: any) => {
  set(targets, { color: 'var(--hex-red)' });
};

export default function Page() {
  useEffect(() => {
    animate('.square', {
      x: '10rem',
      //   scale: stagger([1, 0.1]),
      scale: stagger([0.8, 0.2], { from: 'center' }),
      delay: stagger(500, { from: 'center', start: 1000 }),
      duration: stagger(200, { from: 'center', start: 600 }),
      loop: true,
      alternate: true,
    });

    animate('.circle', {
      y: stagger(['-2.75rem', '2.75rem']),
      rotate: { from: stagger('-.125turn') },
      loop: true,
      alternate: true,
    });

    const tl = createTimeline({ playbackEase: 'linear' });
    tl.add('.rect1', { x: '15rem', onComplete, duration: 2000 })
      .label('circle completes')
      .add(
        ['.rect2', '.rect3'],
        {
          x: '15rem',
          playbackEase: 'linear',
          duration: 2000,
          onComplete, // Callbacks are aslo staggered
        },
        stagger(100, { start: 'circle completes-=1800' })
      );
  }, []);

  return (
    <div className='docs-demo-html h-[100vh]'>
      <div className='square bg-orange-400 w-16 h-16'></div>
      <div className='square bg-orange-400 w-16 h-16'></div>
      <div className='square bg-orange-400 w-16 h-16'></div>
      <div className='square bg-orange-400 w-16 h-16'></div>
      <div className='square bg-orange-400 w-16 h-16'></div>

      <div className='small justified flex mt-10'>
        <div className='circle w-10 h-10 bg-cyan-600'></div>
        <div className='circle w-10 h-10 bg-cyan-600'></div>
        <div className='circle w-10 h-10 bg-cyan-600'></div>
        <div className='circle w-10 h-10 bg-cyan-600'></div>
        <div className='circle w-10 h-10 bg-cyan-600'></div>
        <div className='circle w-10 h-10 bg-cyan-600'></div>
        <div className='circle w-10 h-10 bg-cyan-600'></div>
        <div className='circle w-10 h-10 bg-cyan-600'></div>
        <div className='circle w-10 h-10 bg-cyan-600'></div>
      </div>

      <div className='small justified mt-10'>
        <div className='rect1 w-10 h-10 rounded-sm bg-[#0fa4ae]'></div>
        <div className='rect2 w-10 h-10 rounded-sm bg-[#0fa4ae]'></div>
        <div className='rect3 w-10 h-10 rounded-sm bg-[#0fa4ae]'></div>
      </div>
      <Animatable/>
    </div>
  );
}
