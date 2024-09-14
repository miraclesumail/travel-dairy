/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-11 15:01:53
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-13 00:11:07
 * @FilePath: /nextjs/travel-dairy/src/app/test1/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import Link from 'next/link';
import { BeakerIcon, FolderIcon, ArrowDownCircleIcon, QrCodeIcon } from '@heroicons/react/24/solid';
import { FormEvent, FormEventHandler, useActionState, useOptimistic } from 'react';
import { useFormStatus } from 'react-dom';

interface FormElements extends HTMLFormControlsCollection {
  age: HTMLInputElement;
  gender: HTMLInputElement;
}
interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

const Page = () => {
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

  return (
    <div>
      <BeakerIcon className='size-6 text-yellow-500' />
      <ArrowDownCircleIcon className='size-6 text-orange-500' />
      <QrCodeIcon className='size-6 text-pink-500' />
     
      <FolderIcon className={`size-12 text-sky-500 `} /> page111--- {randomNumber()}
      <Link href='/test2'>go test 2</Link>
      <form action={submit}>
        <input type='text' name='age' />
        <input type='text' name='gender' />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default Page;
