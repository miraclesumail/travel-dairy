/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-12 19:04:52
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-12 20:39:49
 * @FilePath: /travel-dairy/src/app/service/todo.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, CustomAxiosRequestConfig } from '@/app/utils/httpNew';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const getAllTodos = <T = any>(params?: T, config?: Partial<CustomAxiosRequestConfig>) =>
  get<T, Todo[]>('/todos', (params || {}) as T, config);
