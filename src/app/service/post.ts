/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-12 19:04:05
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-12 20:48:44
 * @FilePath: /travel-dairy/src/app/service/post.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, post, CustomAxiosRequestConfig } from '@/app/utils/httpNew';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const getAllPosts = <T = any>(params?: T, config?: Partial<CustomAxiosRequestConfig>) =>
  get<T, Post[]>('/posts', (params || {}) as T, config);

export const createNewPost = <T = Post>(data: T, config?: Partial<CustomAxiosRequestConfig>) =>
  post<T, Post>('/posts', data, config);
