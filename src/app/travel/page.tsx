/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-08 14:58:21
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-12-01 21:32:49
 * @FilePath: /nextjs/travel-dairy/src/app/travel/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import { Suspense, useEffect } from 'react';
import { get, post } from '@/app/utils/httpNew';
import { postService } from '@/app/service';
import Albums from './album';

interface Params {
  aa: number;
}

interface Result {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const Page = () => {
  useEffect(() => {
    // get<Params, Result>('/todos/1', { aa: 8 }).then((res) => {
    //   console.log(res);
    // });
    get<Params, Result>('/todos/1', { aa: 8 }, { loading: true }).then((res) => {
      console.log(res);
    });

    get<any, Post[]>('/posts').then((res) => {
      console.log(res);
    });

    postService.createNewPost({
      id: 111,
      title: 'aaa',
      userId: 1000,
      body: 'llkkoo',
    });
    // post<Post, any>('/posts', {
    //   id: 111,
    //   title: 'aaa',
    //   userId: 1000,
    //   body: 'llkkoo',
    // }).then((res) => {
    //   console.log(res);
    // });
  }, []);

  return (
    <div>
      travel
      <Suspense fallback={<h2>🌀 Loading...</h2>}>
        {/* <Albums artistId={"the-beatles"} /> */}
        <ItemsList />
      </Suspense>
    </div>
  );
};

const SlowItem = ({ id }: { id: number }) => {
  const startTime = performance.now();
  while (performance.now() - startTime < 100) {
    // Do nothing for 5 ms per item to emulate extremely slow code
  }

  return <li className='item'>Post #{id + 1}</li>;
};

const ItemsList = () => {
  const items = [...(Array(3).keys() as any)];

  return (
    <ul className='items'>
      {items.map((id) => (
        <SlowItem id={id} key={id} />
      ))}
    </ul>
  );
};

export default Page;

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

  return [
    {
      id: 13,
      title: 'Let It Be',
      year: 1970,
    },
    {
      id: 12,
      title: 'Abbey Road',
      year: 1969,
    },
    {
      id: 11,
      title: 'Yellow Submarine',
      year: 1969,
    },
    {
      id: 10,
      title: 'The Beatles',
      year: 1968,
    },
    {
      id: 9,
      title: 'Magical Mystery Tour',
      year: 1967,
    },
    {
      id: 8,
      title: "Sgt. Pepper's Lonely Hearts Club Band",
      year: 1967,
    },
    {
      id: 7,
      title: 'Revolver',
      year: 1966,
    },
    {
      id: 6,
      title: 'Rubber Soul',
      year: 1965,
    },
    {
      id: 5,
      title: 'Help!',
      year: 1965,
    },
    {
      id: 4,
      title: 'Beatles For Sale',
      year: 1964,
    },
    {
      id: 3,
      title: "A Hard Day's Night",
      year: 1964,
    },
    {
      id: 2,
      title: 'With The Beatles',
      year: 1963,
    },
    {
      id: 1,
      title: 'Please Please Me',
      year: 1963,
    },
  ];
}
