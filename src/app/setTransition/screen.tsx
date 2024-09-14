/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-14 03:12:39
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-14 03:28:36
 * @FilePath: /nextjs/travel-dairy/src/app/setTransition/screen.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect } from "react";
export const useLogOnRender = (name: string) => {
  useEffect(() => {
    console.info("Re-render: ", name);
  });
};

export const Issues = () => {
  return <div className="issues">List of issues</div>;
};

export const Projects = () => {


  return (
    <div className="projects">
      My projects: very slow list of them
      <br />
      <br />
      <ItemsList />
    </div>
  );
};

export const Reports = () => {
  console.log("REPORTS TRIGGER");
  useLogOnRender("Reports");

  return <div className="reports">Available reports</div>;
};

const SlowItem = ({ id }: { id: number }) => {
    const startTime = performance.now();
    while (performance.now() - startTime < 5) {
      // Do nothing for 5 ms per item to emulate extremely slow code
    }
  
    return <li className="item">Post #{id + 1}</li>;
  };
  
  const ItemsList = () => {
    const items = [...(Array(100).keys() as any)];
  
    return (
      <ul className="items">
        {items.map((id) => (
          <SlowItem id={id} key={id}/>
        ))}
      </ul>
    );
  };
  
