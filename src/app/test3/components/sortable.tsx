/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-11 14:53:59
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-13 01:34:09
 * @FilePath: /travel-dairy/src/app/test3/components/sortable.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import React, { useState } from 'react';

const Sortable = ({ initialItems, itemCount = 10 }: any) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [items, setItems] = useState<UniqueIdentifier[]>(
    () => initialItems ?? createRange<UniqueIdentifier>(itemCount, (index) => index + 1)
  );
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      // Disable smooth scrolling in Cypress automated tests
      scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getIndex = (id: UniqueIdentifier) => items.indexOf(id);
  const activeIndex = activeId ? getIndex(activeId) : -1;

  function handleDragStart(event: DragStartEvent) {
    if (!event.active) {
      return;
    }

    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    setActiveId(null);

    console.log(active, over, 'handleDragEnd');

    if (over) {
      const overIndex = getIndex(over.id);
      if (activeIndex !== overIndex) {
        setItems((items) => arrayMove(items, activeIndex, overIndex));
      }
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { over, active } = event;

    console.log(active, over, 'handleDragOver');
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {items.map((item) => (
            <SortableItem item={item} key={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

const SortableItem = ({ item }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='h-[60px] w-[200px] rounded-lg bg-customBg mb-3 text-center leading-[60px] ml-auto mr-auto'
    >
      this is {item} line
    </div>
  );
};

export default Sortable;

function createRange<T = number>(length: number, initializer: (index: number) => any = defaultInitializer): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

const defaultInitializer = (index: number) => index;
