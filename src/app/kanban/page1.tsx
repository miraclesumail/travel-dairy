/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-18 16:57:07
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-22 02:09:14
 * @FilePath: /travel-dairy/src/app/kanban/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import React, { useRef, useState, DragEvent } from 'react';
import styles from './style.module.scss'

const Index = () => {
  const [active, setActive] = useState(-1);
  const [people, setPeople] = useState([
    {
      id: 1,
      name: 'John Doe',
      content: 'wanna try something exicting',
      sets: '3x10',
    },
    {
      id: 2,
      name: 'Max Walters',
      content: 'are u sure to go',
      sets: '3x10',
    },
    {
      id: 3,
      name: 'Adam Smith',
      content: 'what a terrible cloud',
      sets: '3x10',
    },
    {
      id: 4,
      name: 'Tom Johnson',
      content: 'lie down and tak a breathe',
      sets: '3x10',
    },
  ]);

  const dragPerson = useRef<number>(-1);
  const draggedOverPerson = useRef<number>(-1);

  function handleSort() {
    console.log(dragPerson.current, draggedOverPerson.current, 'handleSorthandleSort');

    if (dragPerson.current == -1 || draggedOverPerson.current == -1 || dragPerson.current == draggedOverPerson.current)
      return;
    const peopleClone = [...people];
    const temp = peopleClone[dragPerson.current];
    peopleClone[dragPerson.current] = peopleClone[draggedOverPerson.current];
    peopleClone[draggedOverPerson.current] = temp;
    setPeople(peopleClone);
  }

  return (
    <main className='flex min-h-screen flex-col items-center space-y-5'>
      <h1 className='text-xl font-bold mt-4'>List active {active}</h1>
      {people.map((person, index) => (
        <div
          key={person.id}
          className='relative flex space-x-3 border rounded p-2 bg-gray-100'
          draggable
          onDragStart={() => (dragPerson.current = index)}
          onDragEnter={(e: DragEvent) => {
            setActive(index);
            // console.log(e, 'onDragEnteronDragEnter');
            draggedOverPerson.current = index;
          }}
          onDragLeave={(e: DragEvent) => {
            setActive(-1);

            console.log((e.target as HTMLElement).tagName, index, 'onDragLeaveonDragLeave');
            draggedOverPerson.current = -1;
          }}
          onDragEnd={handleSort}
          onDragOver={(e) => e.preventDefault()}
        >
          <p>{person.name}</p>
        </div>
      ))}
    </main>
  );
};

export default Index;
