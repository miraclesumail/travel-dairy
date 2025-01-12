/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-12-05 19:22:15
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-12-05 19:43:35
 * @FilePath: /travel-dairy/src/app/template.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';

import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    console.log('Template');
  }, []);

  return (
      <motion.div
        initial={pathname == '/' ? false : { y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: 0.75 }}
      >
        {children}
      </motion.div>
  );
}
