'use client';
import { divide } from 'lodash';
import { AnimationDefinition, motion, Variants } from 'motion/react';
import { useState } from 'react';

const cardVariants: Variants = {
  offscreen: {
    y: 300,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      //   type: 'spring',
      //   bounce: 0.4,
      delay: 0.3,
      ease: 'easeInOut',
      duration: 1,
    },
  },
};

export default function Page() {
  const [x, setX] = useState(200);

  const [todos, setTodos] = useState([
    { key: '1', item: 'qqqqq' },
    { key: '2', item: 'wwwww' },
    { key: '3', item: 'eeeee' },
  ]);

  //   function onAnimationComplete(e: AnimationDefinition) {
  //     console.log(e);

  //     if ((e as any).scale) {
  //       setX(500);
  //     }
  //   }

  function change() {
    const tempTodo = [...todos];
    [tempTodo[0], tempTodo[1]] = [tempTodo[1], tempTodo[0]];
    setTodos(tempTodo);
  }

  return (
    <>
      <motion.div
        className='box w-20 h-20 bg-purple-400 relative'
        // Animate when this value changes:
        animate={{ scale: 2 }}
        // onAnimationComplete={onAnimationComplete}
        transition={{ duration: 3, ease: 'easeInOut' }}
        // Fade in when the element enters the viewport:
        whileInView={{ opacity: 1 }}
        // Animate the component when its layout changes:
        // Style now supports indepedent transforms:
        layout
        style={{ x }}
      />

      <div onClick={change}>change</div>
      {todos.map((todo) => (
        <motion.div
          key={todo.key}
          layout
          transition={{ duration: 1, ease: 'easeInOut' }}
          className='p-5 rounded border-[1px] bg-purple-300 flex flex-row justify-center items-center w-fit'
        >
          {todo.item}
        </motion.div>
      ))}

      <div className='w-full h-lvh relative'>placeholder</div>
      <motion.div
        className='card-container'
        initial='offscreen'
        whileInView='onscreen'
        viewport={{ once: false, amount: 0.5 }}
      >
        <motion.div className='h-[300px] mb-10 w-[500px] flex flex-row items-start' variants={cardVariants}>
          收到红丝带his电话私发会死哦等哈三打哈生怕等哈生怕等哈师德师风所发生的
        </motion.div>
      </motion.div>

      <motion.div
        className='card-container'
        initial='offscreen'
        whileInView='onscreen'
        viewport={{ once: false, amount: 0.5 }}
      >
        <motion.div className='h-[300px] mb-10 w-[500px] flex flex-row items-start' variants={cardVariants}>
          时间飞逝批发价打破附近的算法酒叟放大机搜飞机度搜批发较大生发剂哦的
        </motion.div>
      </motion.div>

      <motion.div
        className='card-container'
        initial='offscreen'
        whileInView='onscreen'
        viewport={{ once: false, amount: 0.5 }}
      >
        <motion.div className='h-[300px] w-[500px] flex flex-row items-start' variants={cardVariants}>
          核对发票收废品是否合适批发和速递费生怕还发啥批发害怕搜达法搜撒打发孙菲菲
        </motion.div>
      </motion.div>
    </>
  );
}
