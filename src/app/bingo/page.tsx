/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-01 01:36:11
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-03 01:05:01
 * @FilePath: /nextjs/travel-dairy/src/app/bingo/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEBi go
 */
'use client';
import useBingo from './useBingo';
import styles from './style.module.scss';

const gridNum = 5;

const test: Person.Foo = {
    foo: '33'
}

export default function Bingo() {
  const { cardArrs, basket, isBingo, nowBingoArrs, gameStatistic } = useBingo(Math.pow(gridNum, 2));

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

      {gameStatistic.map((game) => (
        <div>
          <span>Round: {game.round}</span>
          <span>Count: {game.count}</span>
        </div>
      ))}
    </>
  );
}
