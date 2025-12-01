/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-22 01:24:43
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-12-01 21:33:20
 * @FilePath: /travel-dairy/src/app/kanban/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import React, { useContext, createContext, useState, DragEventHandler } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './style.module.scss';

enum Category {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  ForReview = 'For Review',
  Done = 'Done',
}

type Task = {
  content: string;
  id: string;
};

interface ContextProps {
  columnsData: Record<Category, Task[]>;
  setColumnsData?: (data: Record<Category, Task[]>) => void;
}

const ContextProvider = createContext<ContextProps>({
  columnsData: {
    [Category.ToDo]: [],
    [Category.InProgress]: [],
    [Category.ForReview]: [],
    [Category.Done]: [],
  },
});

const initTasks: Record<Category, Task[]> = {
  [Category.ToDo]: [
    {
      id: uuidv4(),
      content: 'Gather inspiration for layout ideas 🖌️',
    },
    {
      id: uuidv4(),
      content: 'Research Color Palette 🖍️',
    },
    {
      id: uuidv4(),
      content: 'Brand and Logo Design 🎨',
    },
  ],
  [Category.InProgress]: [
    {
      id: uuidv4(),
      content: 'Optimize Image Assets 🏞️',
    },
    {
      id: uuidv4(),
      content: 'Cross-Browser Testing 🌐',
    },
    {
      id: uuidv4(),
      content: 'Integrate Livechat 💬',
    },
  ],
  [Category.ForReview]: [
    {
      id: uuidv4(),
      content: 'Set Up Custom Domain 🌍',
    },
    {
      id: uuidv4(),
      content: 'Deploy Website 🚀',
    },
    {
      id: uuidv4(),
      content: 'Fix Bugs 🛠️',
    },
    {
      id: uuidv4(),
      content: 'Team Meeting 📅',
    },
  ],
  [Category.Done]: [
    {
      id: uuidv4(),
      content: 'Write Report 📊',
    },
    {
      id: uuidv4(),
      content: 'Code Review 💻',
    },
    {
      id: uuidv4(),
      content: 'Implement Billing and Subscription 💰',
    },
  ],
};

const Index = () => {
  const [columnsData, setColumnsData] = useState<Record<Category, Task[]>>(initTasks);

  const categorys = [Category.ToDo, Category.ForReview, Category.InProgress, Category.Done];

  function swapTask(task1Id: string, task2Id: string, status: Category) {
    const tempColumnsData = { ...columnsData };
    let tempCategoryTasks = [...columnsData[status]];
    const task1Index = tempCategoryTasks.findIndex((task) => task.id == task1Id);
    const task2Index = tempCategoryTasks.findIndex((task) => task.id == task2Id);
    [tempCategoryTasks[task1Index], tempCategoryTasks[task2Index]] = [
      tempCategoryTasks[task2Index],
      tempCategoryTasks[task1Index],
    ];
    tempColumnsData[status] = tempCategoryTasks;
    setColumnsData(tempColumnsData);
  }

  const handleDragstart: DragEventHandler<HTMLDivElement> = (event) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', (event.target as HTMLDivElement).dataset.taskid!);
    requestAnimationFrame(() => (event.target as HTMLDivElement).classList.add(styles.dragging));
  };

  const handleDragend: DragEventHandler<HTMLDivElement> = (event) => {
    (event.target as HTMLDivElement).classList.remove(styles.dragging);
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  const handleDragover: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault(); // allow drop

    const draggedTask = document.querySelector(`.${styles.dragging}`);
    const draggedTaskId = (draggedTask as HTMLDivElement).dataset.taskid;
    const status = (draggedTask as HTMLDivElement).dataset.status;

    console.log(draggedTaskId, 'draggedTaskIddraggedTaskIddraggedTaskId')

    const target = (event.target as HTMLDivElement).closest(`.${styles.task}, .tasks`);
    const targetId = (event.target as HTMLDivElement).dataset.taskid;
    const targetStatus = (event.target as HTMLDivElement).dataset.status;


    if (!target || draggedTaskId === targetId) return;

    // 移动到了其他的column
    if (!targetId) {
      // target is the tasks element
      const lastTask = target.lastElementChild;
      if (!lastTask) {
        // tasks is empty
        target.appendChild(draggedTask as any);
      } else {
        const { bottom } = lastTask.getBoundingClientRect();
        event.clientY > bottom && target.appendChild(draggedTask as any);
      }
    } else {
      // target is another
      const { top, height } = target.getBoundingClientRect();
      const distance = top + height / 2;

      if (event.clientY < distance) {
        if (status == targetStatus) {

          console.log('交换了')
          swapTask(draggedTaskId!, targetId, status as Category);
          // target.before(draggedTask as any);
        } 
      } else {
        if (status != targetStatus) target.after(draggedTask as any);
      }
    }
  };

  return (
    <ContextProvider.Provider value={{ columnsData }}>
      <div className='container'>
        <h1>Task List</h1>
      </div>

      <div className='colums w-full flex flex-row gap-10 px-5 justify-between'>
        <ContextProvider.Consumer>
          {({ columnsData: data }: ContextProps) => {
            return categorys.map((category) => (
              <div className='column basis-1/4' key={category}>
                <div className='column-title'>
                  <h3 data-tasks='0'>{category}</h3>
                  <button data-add>
                    <i className='bi bi-plus'></i>
                  </button>
                </div>
                <div className={`tasks flex-col h-[400px]`} onDrop={handleDrop} onDragOver={handleDragover}>
                  {data[category].map((item, index) => (
                    <div
                      key={index}
                      data-taskid={item.id}
                      data-status={category}
                      onDragStart={handleDragstart}
                      onDragEnd={handleDragend}
                      className={`${styles.task} cursor-move duration-300 min-h-[48px] mt-6 bg-[#f0f0f0] hover:bg-[#e2e8f0] px-2 py-2 rounded-[8px] text-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]`}
                      draggable
                    >
                      <div>{item.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            ));
          }}
        </ContextProvider.Consumer>
      </div>
    </ContextProvider.Provider>
  );
};

export default Index;
