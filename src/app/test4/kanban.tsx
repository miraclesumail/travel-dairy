/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-05 01:49:11
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-05 02:08:13
 * @FilePath: /travel-dairy/src/app/test4/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import './style.css';

/** types */
export type Card = {
  id: string;
  title: string;
  description?: string;
};

export type Column = {
  id: string;
  title: string;
  cardIds: string[]; // order matters
};

export type BoardData = {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  columnOrder: string[]; // order of columns
};

/** helper: reorder within same list */
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/** KanbanBoard props */
type KanbanBoardProps = {
  initialData?: BoardData;
  onChange?: (data: BoardData) => void;
};

const defaultData: BoardData = {
  cards: {
    'card-1': { id: 'card-1', title: '设计首页', description: '确定配色与布局' },
    'card-2': { id: 'card-2', title: '实现API', description: '后端完成产品API' },
    'card-3': { id: 'card-3', title: '写单元测试', description: '覆盖Critical路径' },
    'card-4': { id: 'card-4', title: '部署到staging', description: 'CI/CD检查' },
    'card-5': { id: 'card-5', title: '吃月饼', description: '等等快快快' },
    'card-6': { id: 'card-6', title: '睡大觉', description: '大家大口大口' },
    'card-7': { id: 'card-7', title: '溜猫', description: '对对对尽快' },
  },
  columns: {
    'col-1': { id: 'col-1', title: '待办', cardIds: ['card-1', 'card-2', 'card-7'] },
    'col-2': { id: 'col-2', title: '进行中', cardIds: ['card-3'] },
    'col-3': { id: 'col-3', title: '已完成', cardIds: ['card-4', 'card-6'] },
    'col-4': { id: 'col-4', title: '已过期', cardIds: ['card-5'] },
  },
  columnOrder: ['col-1', 'col-2', 'col-3','col-4'],
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialData, onChange }) => {
  const [data, setData] = useState<BoardData>(initialData ?? defaultData);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return; // dropped outside

    // If dragging columns (if we support that later)
    if (type === 'column') {
      if (destination.index === source.index) return;
      const newColumnOrder = reorder(data.columnOrder, source.index, destination.index);
      const newState = { ...data, columnOrder: newColumnOrder };
      setData(newState);
      onChange?.(newState);
      return;
    }

    // If dropped in same column -> reorder
    const startCol = data.columns[source.droppableId];
    const finishCol = data.columns[destination.droppableId];

    if (startCol === finishCol) {
      const newCardIds = reorder(startCol.cardIds, source.index, destination.index);
      const newColumn: Column = { ...startCol, cardIds: newCardIds };
      const newState: BoardData = {
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      };
      setData(newState);
      onChange?.(newState);
      return;
    }

    // Moving from one column to another
    const startCardIds = Array.from(startCol.cardIds);
    startCardIds.splice(source.index, 1);
    const newStart: Column = { ...startCol, cardIds: startCardIds };

    const finishCardIds = Array.from(finishCol.cardIds);
    finishCardIds.splice(destination.index, 0, draggableId);
    const newFinish: Column = { ...finishCol, cardIds: finishCardIds };

    const newState: BoardData = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);
    onChange?.(newState);
  };

  return (
    <div className='kanban-root'>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {(provided) => (
            <div className='kanban-columns' ref={provided.innerRef} {...provided.droppableProps}>
              {data.columnOrder.map((colId, index) => {
                const column = data.columns[colId];
                return (
                  <Draggable draggableId={column.id} index={index} key={column.id}>
                    {(colProvided) => (
                      <div className='kanban-column' ref={colProvided.innerRef} {...colProvided.draggableProps}>
                        <div className='kanban-column-header' {...colProvided.dragHandleProps}>
                          <h3>{column.title}</h3>
                          <span className='kanban-count'>{column.cardIds.length}</span>
                        </div>

                        <Droppable droppableId={column.id} type='card'>
                          {(dropProvided, snapshot) => (
                            <div
                              className={`kanban-card-list ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                              ref={dropProvided.innerRef}
                              {...dropProvided.droppableProps}
                            >
                              {column.cardIds.map((cardId, cardIndex) => {
                                const card = data.cards[cardId];
                                return (
                                  <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                                    {(cardProvided, cardSnapshot) => (
                                      <div
                                        className={`kanban-card ${cardSnapshot.isDragging ? 'dragging' : ''}`}
                                        ref={cardProvided.innerRef}
                                        {...cardProvided.draggableProps}
                                        {...cardProvided.dragHandleProps}
                                      >
                                        <div className='kanban-card-title'>{card.title}</div>
                                        {card.description && <div className='kanban-card-desc'>{card.description}</div>}
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {dropProvided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
