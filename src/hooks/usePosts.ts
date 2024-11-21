/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-23 17:23:35
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-23 17:23:44
 * @FilePath: /travel-dairy/src/hooks/usePosts.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState, useEffect } from 'react';
import getPostsPage from '@/app/actions/getPost';

const usePosts = (pageNum = 1) => {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError({});

    const controller = new AbortController();
    const { signal } = controller;

    getPostsPage(pageNum, { signal })
      .then((data) => {
        setResults((prev) => [...prev, ...data]);
        setHasNextPage(Boolean(data.length));
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (signal.aborted) return;
        setIsError(true);
        setError({ message: e.message });
      });

    return () => controller.abort();
  }, [pageNum]);

  return { isLoading, isError, error, results, hasNextPage };
};

export default usePosts;
