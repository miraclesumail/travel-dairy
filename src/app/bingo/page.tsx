/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-01 01:36:11
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-26 23:24:41
 * @FilePath: /nextjs/travel-dairy/src/app/bingo/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEBi go
 */
'use client';
import useBingo from './useBingo';
import styles from './style.module.scss';
import { drawSolidRect, RectParams } from '@/app/utils';
import { MutableRefObject, useEffect, useRef } from 'react';

const gridNum = 5;

const test: Person.Foo = {
  foo: '33',
};

export default function Bingo() {
  const { cardArrs, basket, isBingo, nowBingoArrs, gameStatistic, gameAxisArrs } = useBingo(Math.pow(gridNum, 2));

  useEffect(() => {
    if (gameAxisArrs.length) {
      console.log(gameAxisArrs, 'gameAxisArrsgameAxisArrs');
    }
  }, [gameAxisArrs]);

  return (
    <>
      {isBingo && <div className={styles.head}>BINGO</div>}
      <div className={styles.container}>
        {cardArrs.map((card) => (
          <div
            key={card}
            className={(nowBingoArrs || []).includes(card) ? styles.bingo : basket.includes(card) ? styles.active : ''}
          >
            {card}
          </div>
        ))}
      </div>

      {gameStatistic.map((game, index) => (
        <div key={game.round} className={styles.gameStatistic}>
          <div className={styles.left}>
            <span>Round: {game.round}</span>
            <span>Count: {game.count}</span>
          </div>

          <Statistic key={index} params={gameAxisArrs[index]} />
        </div>
      ))}
    </>
  );
}

const Statistic = ({ params }: { params: Array<{ x: number; y: number }> }) => {
  const canvasRef: MutableRefObject<any> = useRef<HTMLCanvasElement>();

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.width = 60;
    canvas.height = 60;
    canvas.style.background = '#f0f0f0';

    const ctx = canvas.getContext('2d');

    params.forEach((param, index) => {
      drawSolidRect(ctx as CanvasRenderingContext2D, {
        x: param.x * 12,
        y: param.y * 12,
        width: 12,
        height: 12,
        fillStyle: index % 2 ? 'yellow' : 'green',
      });
    });

    // return () => ctx?.clearRect(0, 0, 60, 60);
  }, []);

  return <canvas className='canvas' ref={canvasRef}></canvas>;
};
