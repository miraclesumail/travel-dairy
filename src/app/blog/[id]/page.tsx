/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-04 00:11:15
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-15 20:31:08
 * @FilePath: /nextjs/travel-dairy/src/app/blog/[id]/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
interface Post {
  id: any;
  title: string;
  content: string;
}

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  let posts: Post[] = await fetch('https://api.vercel.app/blog').then((res) => res.json());
  return posts.map((post) => ({
    id: String(post.id),
  }));
}

export default async function Page(
  { params }: { params: { id: any } },
  searchParams: { [key: string]: string | string[] | undefined }
) {

  console.log(searchParams, 'searchParamssearchParams')
  let post = await fetch(`https://api.vercel.app/blog/${params.id}`).then((res) => res.json());
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  );
}
