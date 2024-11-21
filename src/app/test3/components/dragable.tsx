/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-08 20:08:42
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-08 20:28:47
 * @FilePath: /travel-dairy/src/app/test3/components/dragable.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function Draggable(props: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
