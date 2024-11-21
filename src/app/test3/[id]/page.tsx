/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-07 01:21:18
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-07 01:32:02
 * @FilePath: /travel-dairy/src/app/test3/[id]/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

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


export default async function Page({ params }: { params: { id: any } }) {
  let post = await fetch(`http://localhost:5000/posts/${params.id}`).then((res) => res.json());

  return (
    <main>
      <h1>{post.title}----pppp</h1>
      <div>randomString {randomString(10)}</div>
      <div>randomNumber {randomNumber()}</div>
    </main>
  );
}
