import { post, CustomAxiosRequestConfig } from '@/app/utils/httpNew';

export const register = <T = Record<string, any>>(data: T, config?: Partial<CustomAxiosRequestConfig>) =>
  post<T, any>('/auth/register', data, config);

export const login = <T = Record<string, any>>(data: T, config?: Partial<CustomAxiosRequestConfig>) =>
    post<T, any>('/auth/login', data, config);
