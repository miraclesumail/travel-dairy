/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-23 17:11:23
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-23 18:16:15
 * @FilePath: /travel-dairy/src/app/infiniteScroll/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import useIntersectionObserver from '@/hooks/useIntersection';
import usePosts from '@/hooks/usePosts';
import React, { ForwardedRef, forwardRef, useCallback, useRef, useState } from 'react';

const Page = () => {
  const [pageNum, setPageNum] = useState<number>(1);
  const { isLoading, isError, error, results, hasNextPage }: any = usePosts(pageNum);

  const intObserver: any = useRef();

  const lastPostRef = useCallback(
    (post: any) => {
      if (isLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver(
        (posts) => {
          if (posts[0].isIntersecting && hasNextPage) {
            console.log('We are near the last post!');
            setPageNum((prev) => prev + 1);
          }
        },
        { rootMargin: '0px', threshold: 1 }
      );

      if (post) intObserver.current.observe(post);
    },
    [isLoading, hasNextPage]
  );

  if (isError) return <p className='center'>Error: {error.message}</p>;

  const content = results.map((post: any, i: number) => {
    if (results.length === i + 1) {
      console.log('hhhh');
      return <Post ref={lastPostRef} key={post.id} post={post} />;
    }
    return <Post key={post.id} post={post} />;
  });

  return (
    <div className='flex flex-col items-center'>
      {content}
      {isLoading && <p className='center'>Loading More Posts...</p>}
    </div>
  );
};

const Post = forwardRef(({ post }: any, ref: ForwardedRef<any>) => {
  const postBody = (
    <>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p>Post ID: {post.id}</p>
    </>
  );

  const content = ref ? (
    <article ref={ref} className='px-5 py-5 rounded-[80x] bg-orange-300 mt-3 max-w-[800px]'>
      {postBody}
    </article>
  ) : (
    <article className='px-5 py-5 rounded-[80x] bg-orange-300 mt-3 max-w-[800px]'>{postBody}</article>
  );

  return content;
});

export default Page;
