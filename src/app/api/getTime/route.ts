import { NextResponse } from 'next/server';

/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-18 23:49:00
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-20 20:46:57
 * @FilePath: /travel-dairy/src/app/api/getTime/route.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export async function GET(req: Request) {
//   if (req.method == 'GET') {
    console.log('aa')
    const data = await fetch('https://worldtimeapi.org/api/timezone/Asia/Manila', {cache:'no-cache'});
    const time = await data.json();
    return NextResponse.json(
      {
        time: time.datetime,
      },
      { status: 200 }
    );
  }

//   return NextResponse.json({
//     data: 'qqq',
//   });

