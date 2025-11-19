// 起点  P0 = (X0, Y0)  终点 P1 = (X1, Y1)
// B(t) = (1 - t)^2 * P0 + 2(1 - t)t * P1 + t^2 * P2
// x(t) = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x2
// y(t) = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y2

import React, { useRef, useState } from 'react';
import { useFly as useParabolaFly } from '@/hooks/useFly';

const App: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);
  const cartRef = useRef<HTMLDivElement | null>(null);

  const { addFly, FlyLayer } = useParabolaFly({
    duration: 600, // 动画时长
    height: -240, // 抛物线高度（越负越“高”）
  });

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCartCount((c) => c + 1);

    const fromEl = e.currentTarget;
    const toEl = cartRef.current;

    addFly(fromEl, toEl!);
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      {/* 顶部导航 */}
      <header className='flex items-center justify-between px-6 py-4 bg-white shadow'>
        <div className='text-lg font-semibold'>商城 Demo（useParabolaFly）</div>
        <div
          ref={cartRef}
          className='relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100'
        >
          <span className='text-2xl'>🛒</span>
          {cartCount > 0 && (
            <span className='absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-red-500 text-[11px] text-white flex items-center justify-center'>
              {cartCount}
            </span>
          )}
        </div>
      </header>

      {/* 商品卡片 */}
      <main className='flex-1 flex items-center justify-center p-4'>
        <div className='w-full max-w-sm bg-white rounded-xl shadow p-4 flex flex-col gap-3'>
          <div className='w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm'>
            商品图片
          </div>
          <div className='flex flex-col gap-1'>
            <h2 className='text-lg font-semibold'>React 学习指南</h2>
            <p className='text-sm text-gray-500 line-clamp-2'>
              适合新手入门的 React + TypeScript + TailwindCSS 学习资料。
            </p>
          </div>
          <div className='flex items-center justify-between mt-2'>
            <div className='text-xl font-bold text-rose-600'>¥ 99.00</div>
            <button
              onClick={handleAddToCart}
              className='px-4 py-2 rounded-full bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 active:scale-95 transition'
            >
              加入购物车
            </button>
          </div>
        </div>
      </main>

      {/* 飞行小球层要放在页面最外层 */}
      <FlyLayer />
    </div>
  );
};

export default App;
