/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-28 20:30:11
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-28 20:34:21
 * @FilePath: /travel-dairy/src/hooks/useTheme.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getActiveTheme } from '@/app/actions/getCookie';
import { useEffect, useState } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState('loading');

  useEffect(() => {
    async function fetchTheme() {
      const currentTheme = await getActiveTheme();
      setTheme(currentTheme);
    }
    fetchTheme();
  }, []);

  return theme;
}
