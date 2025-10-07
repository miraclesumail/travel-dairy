'use client';

import KanbanBoard, { BoardData } from './kanban';

export default () => {
  const handleChange = (data: BoardData) => {
    console.log(data, 'BoardDataBoardData');
  };

  return <KanbanBoard onChange={handleChange}/>
};
