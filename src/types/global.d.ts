/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-08-09 01:17:09
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-03 01:04:49
 * @FilePath: /nextjs/travel-dairy/src/types/global.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
declare module '*.mp3' {
  const value: any;
  export default value;
}

interface Test {
  name: string;
  age: number;
}

declare module Person {
  interface Foo {
    foo: string;
  }
}
