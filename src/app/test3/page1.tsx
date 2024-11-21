/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-07 01:07:55
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-07 01:18:59
 * @FilePath: /travel-dairy/src/app/test3/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';

function randomString(e: any) {
  e = e || 32;
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    a = t.length,
    n = '';
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

function randomNumber() {
  return Math.floor(Math.random() * 100);
}

const Page = async () => {
  const data = await fetch('http://localhost:5000/posts');
  const json = await data.json();

  console.log(json, 'json---json')

  return (
    <div>
      page3
      <div>randomString {randomString(10)}</div>
      <div>randomNumber {randomNumber()}</div>
    </div>
  );
};

export default Page;
