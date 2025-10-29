/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-23 17:22:13
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-27 18:41:07
 * @FilePath: /travel-dairy/src/app/actions/getPost.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { cookies } from 'next/headers';

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

export default async function (pageParam = 1, options = {}) {
  const response = await api.get(`/posts?_page=${pageParam}`, options);
  return response.data;
}
