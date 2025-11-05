/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-11-01 20:10:38
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-11-02 03:12:40
 * @FilePath: /travel-dairy/src/app/utils/ui/showModal.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Demo } from './demo';

interface ModalInstance {
  root: Root;
  container: HTMLDivElement;
}

const modalMap = new Map<string, ModalInstance>();

export const destroyModal = (mark: string) => {
  if (modalMap.has(mark)) {
    let { root, container } = modalMap.get(mark)!;
    root.unmount();
    document.body.removeChild(container);
    modalMap.delete(mark);
  }
};

const closeAll = () => modalMap.forEach((value, key) => destroyModal(key));

export function showDemo() {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  root.render(<Demo />);

  modalMap.set('demo', { root, container });
  return { closeWithoutAnimate: () => root.unmount() };
}
