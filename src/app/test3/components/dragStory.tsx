import React, { forwardRef, useMemo, useState } from 'react';
import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
} from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';
import { CSS } from '@dnd-kit/utilities';
import { draggable, draggableHorizontal, draggableVertical } from './dragSvg';
import { restrictToHorizontalAxis, restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import type { Coordinates } from '@dnd-kit/utilities';

export enum Axis {
  All,
  Vertical,
  Horizontal,
}
const defaultCoordinates = {
  x: 0,
  y: 0,
};

interface Props {
  activationConstraint?: PointerActivationConstraint;
  axis?: Axis;
  handle?: boolean;
  buttonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  label?: string;
  dragging?: boolean;
  listeners?: any;
  modifiers?: Modifiers;
  transform?: Transform | null;
}

function DraggableStory({ activationConstraint, label = 'Go ahead, drag me.', style, axis, modifiers }: Props) {
  // 位移坐标x、y
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  //   const mouseSensor = useSensor(MouseSensor, {
  //     activationConstraint,
  //   });
  //   const touchSensor = useSensor(TouchSensor, {
  //     activationConstraint,
  //   });
  //   const keyboardSensor = useSensor(KeyboardSensor, {});
  //   const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      modifiers={modifiers}
      onDragEnd={({ delta }) => {
        console.log(x, y, '我我我哦');

        setCoordinates(({ x, y }) => {
          return {
            x: x + delta.x,
            y: y + delta.y,
          };
        });
      }}
    >
      <DraggableItem label={label} top={y} left={x} style={style} axis={axis} />
    </DndContext>
  );
}

interface DraggableItemProps {
  label: string;
  handle?: boolean;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  axis?: Axis;
  top?: number;
  left?: number;
}

function DraggableItem({ axis, label, style, top, left, handle, buttonStyle }: DraggableItemProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });

  return (
    <Draggable
      ref={setNodeRef}
      dragging={isDragging}
      handle={handle}
      label={label}
      listeners={listeners}
      style={{ ...style, top, left }}
      buttonStyle={buttonStyle}
      transform={transform}
      axis={axis}
      {...attributes}
    />
  );
}

const Draggable = forwardRef<HTMLButtonElement, Props>(function Draggable(
  { dragOverlay, dragging, handle, label, listeners, transform, style, buttonStyle, axis, ...props }: any,
  ref
) {
  const transformTemp = transform
    ? CSS.Translate.toString({ ...transform, x: transform.x + style.left, y: transform.y + style.top })
    : null;

  console.log(transform, 'transformtransform');
  return (
    <div
      style={
        {
          ...style,
          transform: transformTemp || `translate3d(${style.left}, ${style.top})`,
        } as React.CSSProperties
      }
    >
      <button
        {...props}
        ref={ref}
        aria-label='Draggable'
        data-cypress='draggable-item'
        {...(handle ? {} : listeners)}
        tabIndex={handle ? -1 : undefined}
        style={buttonStyle}
      >
        {axis === Axis.Vertical ? draggableVertical : axis === Axis.Horizontal ? draggableHorizontal : draggable}
        喔喔我哦我我我都觉得杰西卡
      </button>
      {label ? <label>{label}</label> : null}
    </div>
  );
});

export const BasicSetup = () => <DraggableStory />;

export const DragHandle = () => <DraggableStory label='Drag with the handle' handle />;

export const PressDelay = () => (
  <DraggableStory
    label='Hold me to drag'
    activationConstraint={{
      delay: 250,
      tolerance: 5,
    }}
  />
);

export const HorizontalAxis = () => (
  <DraggableStory label='Draggable horizontally' axis={Axis.Horizontal} modifiers={[restrictToHorizontalAxis]} />
);

// export const VerticalAxis = () => (
//   <DraggableStory label='Draggable vertically' axis={Axis.Vertical} modifiers={[restrictToVerticalAxis]} />
// );

// export const RestrictToWindowEdges = () => (
//   <OverflowWrapper>
//     <DraggableStory label="I'm only draggable within the window bounds" modifiers={[restrictToWindowEdges]} />
//   </OverflowWrapper>
// );
