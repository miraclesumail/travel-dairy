import axios, { InternalAxiosRequestConfig, Canceler, AxiosRequestConfig } from 'axios';

export interface ApiResponse<T> {
  code?: number;
  message?: string;
  data: T;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  loading?: boolean;
  retryCfg?: {
    retry: number;
    retryDelay: number;
    currentRetryCount: number;
  };
}

const pendingMap = new Map<string, Canceler>();

let loadingCount = 0;
/**
 * 开启全局 loading
 */
export function startLoading() {
  if (loadingCount === 0)
    // showGlobalLoading();
    loadingCount++;
}

/**
 * 关闭全局 loading
 */
export function stopLoading() {
  loadingCount = Math.max(loadingCount - 1, 0);
  if (loadingCount === 0) {
    // hideGlobalLoading();
  }
}

const getRequestKey = (config: InternalAxiosRequestConfig) => {
  const { url, data, params, method } = config;
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
};

const addPending = (config: InternalAxiosRequestConfig) => {
  const key = getRequestKey(config);
  removePending(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      pendingMap.set(key, cancel);
    });
};

const removePending = (config: InternalAxiosRequestConfig) => {
  const key = getRequestKey(config);
  if (pendingMap.has(key)) {
    const cancel = pendingMap.get(key);

    cancel && cancel('cancel duplicate request test111');
    pendingMap.delete(key);
  }
};

const clearPending = () => {
  pendingMap.forEach((cancel) => cancel && cancel('cancel all requests'));
  pendingMap.clear();
};

const service = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

service.interceptors.request.use((config) => {
  const { retryCfg = { retry: 5, retryDelay: 1000, currentRetryCount: 0 } } = config as CustomAxiosRequestConfig;
  if (config.url == '/posts' && retryCfg.currentRetryCount < 3) {
    (config as any).retryCfg = retryCfg;
    return Promise.reject({ message: 'this is hand-caused error for test', config });
  }
  if ((config as any).laading) {
    startLoading();
  }
  addPending(config);
  config.headers.Authorization = 'Bearerooiie9900pp-';
  return config;
});

service.interceptors.response.use(
  (response) => {
    removePending(response.config);
    stopLoading();
    console.log(response.config, 'responseresponse');
    return response.data;
  },
  async (error) => {
    console.log(error);
    stopLoading();

    if (error.message == 'this is hand-caused error for test') {
      const retryCfg = error.config.retryCfg;

      if (retryCfg.retry && retryCfg.currentRetryCount < retryCfg.retry) {
        const delay = retryCfg.retryDelay | 1000;
        retryCfg.currentRetryCount += 1;

        console.warn(`请求失败, ${delay}ms后重试第${retryCfg.currentRetryCount}次：${error.config.url}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return service({
          ...error.config,
          retryCfg,
        });
      }
    }
    if (axios.isCancel(error)) {
      console.warn('duplicate request canceled', error.message);
    }
    return error;
  }
);

export function request<P = any, T = any>(
  config: AxiosRequestConfig & { data?: P; params?: P }
): Promise<ApiResponse<T>> {
  const { timeout, ...rest } = config;
  if (timeout) (rest as any).timeout = timeout;
  return service(rest);
}

/**
 * GET 请求
 * @param url 请求路径
 * @param params 请求参数（泛型 P）
 * @returns Promise<ApiResponse<T>>
 */
export const get = <P = any, T = any>(
  url: string,
  params?: P,
  config?: CustomAxiosRequestConfig
): Promise<ApiResponse<T>> => request<P, T>({ method: 'GET', url, params, ...config });

/**
 * POST 请求
 * @param url 请求路径
 * @param data 请求体（泛型 P）
 * @returns Promise<ApiResponse<T>>
 */
export const post = <P = any, T = any>(
  url: string,
  data?: P,
  config?: CustomAxiosRequestConfig
): Promise<ApiResponse<T>> => request<P, T>({ method: 'POST', url, data, ...config });
