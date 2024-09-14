/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-04 20:48:15
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-07-04 23:39:23
 * @FilePath: /nextjs/travel-dairy/src/app/api/route.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  console.log(searchParams.get('name'));
  return Response.json({ data: "www" });
}
