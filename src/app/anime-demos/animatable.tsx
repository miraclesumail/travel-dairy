import { createAnimatable } from 'animejs/animatable';
import { clamp } from 'animejs/utils';
import { useEffect } from 'react';

export default function Animateble() {
  useEffect(() => {
    const container = document.querySelector('#container');
    const box = document.querySelector('#box');

    let bounds = container!.getBoundingClientRect();

    const animatebleBox = createAnimatable(box!, {
      x: 500,
      y: 500,
      ease: 'out(3)',
    });

    const onMouseMove = (e: MouseEvent) => {
      const { width, height, left, top } = bounds;
      const hw = width / 2;
      const hh = height / 2;
      const x = clamp(e.clientX - left - hw, -hw, hw);
      const y = clamp(e.clientY - top - hh, -hh, hh);
      animatebleBox.x(x); // Animate the x value in 500ms
      animatebleBox.y(y); // Animate the y value in 500ms
    };

    window.addEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div className='bg-[#403f24] rounded-[10px] w-[180px] h-[120px] flex justify-center items-center' id='container'>
      <div className='bg-[#f9f640] w-10 h-10' id='box'></div>
    </div>
  );
}
