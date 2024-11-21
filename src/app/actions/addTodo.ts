/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-09-20 20:50:11
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-23 17:22:20
 * @FilePath: /travel-dairy/src/app/actions/addTodo.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use server';
import { revalidatePath } from 'next/cache';

export default async function addTodo(formData: FormData) {
  const todoItem = formData.get('todo');
  console.log(todoItem, 'todoItem');
  if (!todoItem) {
    return;
  }

  revalidatePath('/cache');
}
