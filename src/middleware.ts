/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-18 18:07:55
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-18 20:10:22
 * @FilePath: /travel-dairy/src/middleware.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { headers, cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

const delay = (time: number) => new Promise((resolve) => setTimeout(() => resolve(1), time * 1000));

export async function middleware(request: NextRequest) {
  const cookie = cookies();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hello-from-middleware1', 'hello');

  // cookie.set('AAA', 'COKIRW')
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('x-hello-from-middleware', request.url);

  console.log('middleware', cookie.get('name'), cookie.get('auth'));

  // if (cookie.get('auth')?.value != 'www' && !request.url.includes('/setting')) {
  //   return NextResponse.redirect(new URL('/setting', request.url));
  // }
  return response;
}

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//     // '/test/:path*'
//   ],
// };
