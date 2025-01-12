'use client';
import { Skeleton, Card } from '@nextui-org/react';
import { faker } from '@faker-js/faker';
import { ReactElement, useEffect, useState, Children, cloneElement, CSSProperties } from 'react';
import { isEmpty } from 'lodash';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Resend } from 'resend';
const resend = new Resend('re_W1hC4aA2_Aw4tbnE8BWvGfgDYmD2pgATz');

const delay = <T extends Object>(time: number) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(1 as any), time * 1000));

async function mockData() {
  await delay(1);
  const data = new Array(3).fill(1).map((i) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 10, max: 30 }),
    avatar: faker.image.avatar(),
  }));

  console.log(data);

  return data;
}

function usePromise<T extends Object>(promise: Promise<T>) {
  const [error, setError] = useState(null);
  const [data, setData] = useState<T>(null as any);

  useEffect(() => {
    promise.then((data) => setData(data)).catch((err) => setError(err));
  }, []);

  return {
    error,
    data,
  };
}

const ChildWrap = ({ children, style }: { children: ReactElement[]; style?: CSSProperties }) => {
  return Children.map(children, (child) => (
    <div className='bg-orange-300'>
      {cloneElement(child, {
        ...child.props,
        style: {
          opacity: '0.5',
        },
      })}
    </div>
  ));
};

export default function Page() {
  const { data } = usePromise(mockData());
  const { data: data1 } = usePromise(delay(2));

  console.log(process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PERSO);

  async function sendEmail() {
    try {
      const data = await (await fetch('/api/send', { method: 'POST' })).json();
      console.log(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return (
    <>
      <picture>
        <source
          media='(prefers-color-scheme: dark)'
          srcSet='
      https://api.star-history.com/svg?repos=star-history/star-history&type=Date&theme=dark
    '
        />
        <source
          media='(prefers-color-scheme: light)'
          srcSet='
      https://api.star-history.com/svg?repos=star-history/star-history&type=Date
    '
        />
        <img alt='Star History Chart' src='https://api.star-history.com/svg?repos=facebook/react&type=Date' />
      </picture>
      <i className='icon-[cnx--account-filled] size-8 text-emerald-500'/>

      <Card className='w-[200px] space-y-5 p-4 object-cover' radius='lg'>
        <div onClick={sendEmail}>send</div>
        <Skeleton
          className={cn('rounded-lg', !isEmpty(data) ? 'h-auto' : 'h-24')}
          isLoaded={!isEmpty(data)}
          classNames={{ content: 'space-y-5' }}
        >
          {(data || []).map((item) => (
            <div className='h-24 rounded-lg bg-default-200' key={item.name}>
              {item.name}
              <Image src={item.avatar} alt='' className='rounded object-cover w-auto' height={60} width={60} />
            </div>
          ))}
        </Skeleton>

        <Skeleton className='rounded-lg h-10' isLoaded={!!data1}>
          <div>this is message111</div>
        </Skeleton>

        <ChildWrap>
          <h1>dhdkdjdd</h1>
          <h1>sdfsdfsdfsdf</h1>
          <h1>还是计算机视觉</h1>
        </ChildWrap>
      </Card>
    </>
  );
}
