/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-01 01:39:25
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-26 23:25:21
 * @FilePath: /nextjs/travel-dairy/src/app/bingo/useBingo.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { useEffect, useRef, useState } from 'react';

const arrs = Array.from({ length: 100 }, (_, index) => index + 1);

function pickFromArr(arr: any[], pickNum: number) {
  const cloneArrs = [...arr];
  let pickArrs: any[] = [];

  while (pickArrs.length < pickNum) {
    const index = Math.floor(Math.random() * cloneArrs.length);
    pickArrs = pickArrs.concat(cloneArrs.splice(index, 1));
  }

  return pickArrs;
}

function isChild(parent: any[], chArr: any[]) {
  for (let i = 0; i < chArr.length; i++) {
    if (!parent.includes(chArr[i])) {
      return false;
    }
  }
  return true;
}

function getBingoArrs(cardArrs: any[]) {
  const line = Math.sqrt(cardArrs.length);

  const bingoArrs = [];

  for (let i = 0; i < line * 2; i++) {
    if (i < line) {
      const arrs = Array.from({ length: line }, (_, index) => i + index * line);
      bingoArrs.push(arrs.map((arr) => cardArrs[arr]));
    } else {
      const gap = i - line;
      const arrs = Array.from({ length: line }, (_, index) => index + gap * line);
      bingoArrs.push(arrs.map((arr) => cardArrs[arr]));
    }
  }

  const arrs1 = Array.from({ length: line }, (_, index) => (index + 1) * (index + 1) - 1 + index * (line - index - 1));

  const arrs2 = Array.from({ length: line }, (_, index) => arrs1[index] + line - 1 - index * 2);

  bingoArrs.push(arrs1.map((arr) => cardArrs[arr]));
  bingoArrs.push(arrs2.map((arr) => cardArrs[arr]));
  console.log(bingoArrs);

  return bingoArrs;
}

export default function useBingo(total: number) {
  const [basket, setBasket] = useState<any>([]);
  const [cardArrs, setCardArrs] = useState<any[]>([]);
  const [cardPool, setCardPool] = useState<any[]>([]);
  const [bingoArrs, setBingoArrs] = useState<any[]>([]);
  const [gameStatistic, setGameStatistic] = useState<any[]>([]);
  const [gameAxisArrs, setGameAxisArrs] = useState<any[]>([]);
  const [round, setRound] = useState<number>(1);

  const timer = useRef<any>(null);
  const clearTimer = useRef<any>(null);

  const nowBingoArrs = bingoArrs.find((bingoArr) => isChild(basket, bingoArr));

  const isBingo: boolean = !!nowBingoArrs;

  const generateCard = () => {
    const cards = pickFromArr(arrs, total);
    setCardArrs([...cards]);
    setCardPool([...cards]);
    setBingoArrs(getBingoArrs([...cards]));
  };

  const reset = () => {
    setBasket([]);
    generateCard();
    doCardPool();
    clearTimeout(clearTimer.current);
  };

  const doCardPool = () => {
    timer.current = setInterval(() => {
      setCardPool((prev: any[]) => {
        const target = prev.splice(Math.floor(Math.random() * prev.length), 1);

        setBasket((prev: any[]) => prev.concat(target));
        return prev;
      });
    }, 2 * 1000);
  };

  useEffect(() => {
    generateCard();
    doCardPool();

    return () => {
      clearInterval(timer.current);
      clearTimeout(clearTimer.current);
    };
  }, []);

  useEffect(() => {
    if (isBingo) {
      setRound((prev) => {
        setGameStatistic((prevGame: any[]) => [
          ...prevGame,
          {
            round: prev,
            count: basket.length,
          },
        ]);

        return prev + 1;
      });
      clearTimer.current = setTimeout(reset, 5 * 1000);
    }

    if (basket.length == total || isBingo) {
      clearInterval(timer.current);
    }
  }, [basket, isBingo]);

  useEffect(() => {
    if (!!nowBingoArrs && Array.isArray(nowBingoArrs)) {
      const currentAxisArr = nowBingoArrs
        .map((bingoArr) => cardArrs.indexOf(bingoArr))
        .map((bingoArr) => ({
          x: bingoArr % Math.sqrt(total),
          y: Math.floor(bingoArr / Math.sqrt(total)),
        }));
      setGameAxisArrs((prev) => ([...prev, currentAxisArr]));
    }
  }, [nowBingoArrs, cardArrs]);

  return {
    cardArrs,
    cardPool,
    basket,
    round,
    bingoArrs,
    nowBingoArrs,
    gameStatistic,
    gameAxisArrs,
    isBingo,
  };
}
