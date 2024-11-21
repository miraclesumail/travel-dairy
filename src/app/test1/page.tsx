/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-11 15:01:53
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-11-21 15:25:12
 * @FilePath: /nextjs/travel-dairy/src/app/test1/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import Link from 'next/link';
import { BeakerIcon, FolderIcon, ArrowDownCircleIcon, QrCodeIcon } from '@heroicons/react/24/solid';
import { FormEvent, FormEventHandler, useActionState, useEffect, useOptimistic, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { create } from 'zustand';
import './styles.scss';
import Image from 'next/image';
import { useTeststore } from '@/app/test1/store';
import { useT } from '@/i18n'

interface FormElements extends HTMLFormControlsCollection {
  age: HTMLInputElement;
  gender: HTMLInputElement;
}
interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const options: IntersectionObserverInit = {
  rootMargin: '0px',
  threshold: 1,
};

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const { t } = useT(['home', 'common'])

  const { age, increase } = useTeststore((state) => state);

  const obRef = useRef<any>();
  function randomNumber() {
    return Math.floor(Math.random() * 100);
  }

  function handleSubmit(e: FormEvent<UsernameFormElement>) {
    e.preventDefault();
    console.log(e.currentTarget.elements.age.value);
    console.log(e.currentTarget.elements.gender);
  }

  function submit(formData: FormData) {
    console.log(formData.get('age'));
  }

  console.log(obRef.current, 'obRef.currentobRef.current');

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    if (obRef.current) {
      observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) observer?.disconnect();
        callback(entries);
      }, options);
      observer.observe(obRef.current);
    }

    return () => observer?.disconnect();
  }, [obRef.current]);

  function callback(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      console.log(entry.isIntersecting, entry.intersectionRatio, 'intersectionRatiointersectionRatio');
    });
  }

  return (
    <div>
      <div className='testFont' onClick={increase}>
        ssss {age} {t('topone-product-to-provide')}
      </div>
      <Link href='/test2'>go test 2 </Link>

      <Image
        src={require('./i/18rmb.png')}
        alt=''
        width={100}
        height={30}
        sizes='(max-width: 600px) 128px,
         256px'
      />
      <img
        style={{ width: '100%' }}
        sizes='50vw'
        src='https://placehold.co/3200x800/png'
        srcSet={
          'https://placehold.co/800x200/png   800w,https://placehold.co/1600x400/png 1600w,https://placehold.co/3200x800/png 3200w'
        }
      />
      <BeakerIcon className='size-6 text-yellow-500' />
      <ArrowDownCircleIcon className='size-6 text-orange-500' />
      <QrCodeIcon className='size-6 text-pink-500' />
      <FolderIcon className={`size-12 text-sky-500 `} /> page111--- {randomNumber()}
      <Link href='/test2'>go test 2</Link>
      <Link href='/test3'>go test 3</Link>
      <Button variant={'destructive'} disabled style={{ width: 100, height: 100, borderRadius: 30 }}>
        Click me
      </Button>
      <form action={submit}>
        <input type='text' name='age' />
        <input type='text' name='gender' />
        <button type='submit'>Submit</button>
      </form>
      <div className='w-[200px] h-[800px] bg-yellow-700'></div>
      <div ref={obRef} className='w-[200px] h-[200px] bg-blue-300'></div>
    </div>
  );
};

export default Page;
