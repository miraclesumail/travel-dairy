/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-08 15:00:00
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-26 01:35:57
 * @FilePath: /nextjs/travel-dairy/src/app/utils/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export function use(promise: any) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      (result: any) => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      (reason: any) => {
        promise.status = 'rejected';
        promise.reason = reason;
      }
    );
    throw promise;
  }
}

export interface RectParams {
  x: number;
  y: number;
  width: number;
  height: number;
  fillStyle: string;
}

export function drawSolidRect(ctx: CanvasRenderingContext2D, params: RectParams) {
  const { x, y, width, height, fillStyle } = params;
  ctx.fillStyle = fillStyle;
  ctx.fillRect(x, y, width, height);
}
