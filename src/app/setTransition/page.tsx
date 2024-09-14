/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-14 03:10:39
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-14 03:25:34
 * @FilePath: /nextjs/travel-dairy/src/app/setTransition/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';

import { useState, useTransition } from 'react';
import { Issues, Projects, Reports } from './screen';
import "./style.scss";

type Screens = 'issues' | 'projects' | 'reports';

export default function App() {
  const [tab, setTab] = useState<Screens>('issues');
  const [isPending, startTransition] = useTransition();

  console.log(tab)

  return (
    <div className='container'>
      <div className='tabs'>
        <TabButton isActive={tab === 'issues'} onClick={() => setTab('issues')} name='Issues' />
        <TabButton
          // indicate that the content is loading
          isActive={tab === 'projects'}
          onClick={() => {
            // call setTab inside a function
            // that is passed to startTransition
            // startTransition(() => {
              setTab('projects');
            // });
          }}
          name='Projects'
        />
        <TabButton isActive={tab === 'reports'} onClick={() => setTab('reports')} name='Reports' />
      </div>
      <div className='content'>
        {tab === 'issues' && <Issues />}
        {tab === 'projects' && <Projects />}
        {tab === 'reports' && <Reports />}
      </div>
    </div>
  );
}

type NavButtonProps = {
  isActive?: boolean;
  isLoading?: boolean;
  name: string;
  onClick: () => void;
};

const TabButton = ({ name, onClick, isActive, isLoading }: NavButtonProps) => {
  return (
    <button onClick={onClick} className={`tab-button ${isActive ? 'active' : ''}`}>
      {name}
      {isLoading ? ' 🤔...' : ''}
    </button>
  );
};
