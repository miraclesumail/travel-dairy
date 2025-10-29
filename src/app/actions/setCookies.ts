/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-27 18:41:33
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-27 18:45:47
 * @FilePath: /travel-dairy/src/app/actions/setCookies.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use server';

import { cookies } from 'next/headers';

export default async function(theme: string) {
  cookies().set('theme', theme);
}
