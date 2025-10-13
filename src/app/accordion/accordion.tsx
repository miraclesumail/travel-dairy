/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-13 18:09:11
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-13 19:16:51
 * @FilePath: /travel-dairy/src/app/accordion/accordion.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEo
 */
import { FC, ReactNode } from 'react';

export interface AccordionItemProps {
  title: ReactNode;
  open: boolean;
  children: ReactNode;
  index: number;
  id: string;
  onItemClick: (index: number) => void;
}

export interface AccordionProps {
  dataList: AccordionItemProps[];
}

const AccordionItem: FC<AccordionItemProps> = (props) => {
  const { index, title, children, open, onItemClick, id } = props;

  return (
    <div className='item'>
      <input type='checkbox' id={id} checked={open} onChange={() => onItemClick(index)} />
      <div className='header'>
        <label className='label' htmlFor={id}>
          {title}
        </label>
      </div>
      <div className='content'>
        <div>
          {children}
          {/* <p>面板三的内容。</p>
        <ul>
          <li>支持纯 CSS 控制</li>
          <li>不依赖 JavaScript</li>
          <li>动画流畅</li>
        </ul> */}
        </div>
      </div>
    </div>
  );
};

const Accordion = (props: AccordionProps) => {
  const { dataList } = props;
  return dataList.map((item, index) => <AccordionItem key={index} {...item} />);
};

export default Accordion;
