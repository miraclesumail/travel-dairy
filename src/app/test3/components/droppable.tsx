/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-09 20:23:25
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-09 21:05:19
 * @FilePath: /travel-dairy/src/app/test3/components/droppable.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useDroppable } from '@dnd-kit/core';

export default function Droppable(props: React.PropsWithChildren<any>) {
  const { isOver, setNodeRef } = useDroppable({ id: 'droppable' });

  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={{ ...style, marginTop: 200}} className='h-[100px] w-[100px] rounded-lg bg-customBg'>
      {props.children}
    </div>
  );
}
