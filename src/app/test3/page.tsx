'use client';
import { DndContext, DragOverEvent, DragMoveEvent } from '@dnd-kit/core';
import { BasicSetup, HorizontalAxis } from './components/dragStory';
import Draggable from './components/dragable';
import Droppable from './components/droppable';
import Sortable from './components/sortable';
import { useEffect, useState } from 'react';
import executeFn from '@/app/actions/executeFn';

const Page = () => {
  const [isDropped, setIsDropped] = useState(false);

  const draggableMarkup = <Draggable>Drag me</Draggable>;

  useEffect(() => {
    (async () => {
      const data = await executeFn();

      console.log(data, 'hahaha');
    })();
  }, []);

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (over?.id == 'droppable') {
      setIsDropped(true);
    } else {
      setIsDropped(false);
    }
    console.log(active, over, 'handleDragOver happen----');
  }

  function handleDragMove(event: DragMoveEvent) {
    const { delta, active } = event;
  }

  function handleDragEnd(event: DragMoveEvent) {
    const { delta, active } = event;
    console.log(delta, active, 'handleDragEnd happen----');
  }

  return (
    <div>
      page
      <Sortable />
      <DndContext onDragOver={handleDragOver} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
        {!isDropped ? draggableMarkup : null}
        <Droppable>{isDropped ? draggableMarkup : 'Drop here'}</Droppable>
      </DndContext>
      <BasicSetup />
      <HorizontalAxis />
    </div>
  );
};

export default Page;
