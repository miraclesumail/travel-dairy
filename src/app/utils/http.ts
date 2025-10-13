import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface HttpAxiosResponse extends AxiosResponse {
  config: InternalAxiosRequestConfig & Record<string, any>;
}

const instance = axios.create({ baseURL: '/api' });

class EventEmitter {
  public event: Record<string, any[]>;

  constructor() {
    this.event = {};
  }

  on(type: string, cbres: (params: any) => void, cbrej: (params: any) => void) {
    if (!this.event[type]) {
      this.event[type] = [[cbres, cbrej]];
    } else {
      this.event[type].push([cbres, cbrej]);
    }
  }

  emit(type: string, res: any, ansType: 'resolve' | 'reject') {
    if (!this.event[type]) return;
    else {
      this.event[type].forEach((cbArr) => {
        if (ansType == 'resolve') {
          cbArr[0](res);
        } else {
          cbArr[1](res);
        }
      });
    }
  }
}

function generateReqKey(config: InternalAxiosRequestConfig) {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
}

const pendingRequest = new Set();

const ev = new EventEmitter();

instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig & Record<string, any>) => {
    const reqKey = generateReqKey(config);
    
    if (pendingRequest.has(reqKey)) {
      let res = null;

      try {
        res = await new Promise((resolve, reject) => {
          ev.on(reqKey, resolve, reject);
        });

        return Promise.reject({
          type: 'limitResSuccess',
          val: res,
        });
      } catch (limitFunErr) {
        return Promise.reject({
          type: 'limitResError',
          val: limitFunErr,
        });
      }
    } else {
      config.pendKey = reqKey;
      pendingRequest.add(reqKey);
    }

    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response: HttpAxiosResponse) {
    handleSuccessResponse_limit(response);
    return response;
  },
  function (error: any) {
    handleErrorResponse_limit(error);
  }
);

function handleSuccessResponse_limit(response: HttpAxiosResponse) {
  const reqKey = response.config.pendKey;

  if (pendingRequest.has(reqKey)) {
    pendingRequest.delete(reqKey);
    ev.emit(reqKey, response, 'resolve');
    delete ev.event[reqKey];
  }
}

function handleErrorResponse_limit(error: any) {}
