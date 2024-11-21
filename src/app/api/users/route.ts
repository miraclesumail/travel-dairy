import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { Buffer } from 'node:buffer';
/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-16 21:09:00
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-20 21:13:38
 * @FilePath: /travel-dairy/src/app/api/users/route.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const users = [
  { name: 'tom', gender: 'male', age: 18 },
  { name: 'jay', gender: 'female', age: 19 },
];

const users1 = [
  { name: 'tom11', gender: 'male', age: 18 },
  { name: 'jay11', gender: 'female', age: 19 },
];

async function streamToBuffer(readableStream: any) {
  return new Promise((resolve, reject) => {
    const chunks: any = [];
    readableStream.on('data', (data: any) => {
      if (typeof data === 'string') {
        // Convert string to Buffer assuming UTF-8 encoding
        chunks.push(Buffer.from(data, 'utf-8'));
      } else if (data instanceof Buffer) {
        chunks.push(data);
      } else {
        // Convert other data types to JSON and then to a Buffer
        const jsonData = JSON.stringify(data);
        chunks.push(Buffer.from(jsonData, 'utf-8'));
      }
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}

export async function GET(request: Request) {
  return new NextResponse(JSON.stringify(users), { status: 200 });
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const buf = await (data.get('aa') as any).stream();
    console.log(buf);
    // const reader = new FileReader();
    // if (data.get('aa')) {
    //   reader.readAsArrayBuffer(data.get('aa') as any);
    //   reader.onload = readerEvent => {
    //     const fileText = readerEvent.target?.result
    //     console.log(fileText);
    //   }
    // }
    // const buffer = await streamToBuffer(data.get('aa'))

    // console.log(Buffer.from(data.get('aa') as any));

    writeFile('./TEST1.png', buf);
    writeFile('./qq.txt', [Buffer.from('aaa'), Buffer.from('bbb')]);

    return new NextResponse(JSON.stringify(users1), { status: 200 });
  } catch (error: any) {
    return new NextResponse('Error in creating user' + error.message, {
      status: 500,
    });
  }
}
