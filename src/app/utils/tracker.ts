import dayjs from 'dayjs';
import { postService } from '@/app/service';

interface TrackerConfig {
  reportUrl: string;
  batchSize?: number;
  batchInterval?: number;
  userId?: string;
}

export enum TrackType {
  /** 浏览商品 */
  VIEW_PRODUCT = 'view_product',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  /** 收藏商品 */
  PRODUCT_COLLECTION = 'product_collection',
  /** 评价商品 */
  COMMENT = 'comment',
  /** 购买商品 */
  CHECKOUT = 'checkout',
  /** 点赞商品 */
  HIT_LIKE = 'hit_like',
  /** 添加购物车 */
  ADD_TO_CART = 'add_to_cart',
  /** 页面停留 */
  PAGE_STAY = 'page_stay',
}

type TrackContent = {
  [TrackType.VIEW_PRODUCT]: {
    productId: string;
    userId: string;
    time: string;
  };
  [TrackType.USER_LOGIN]: {
    userId: string;
    time: string;
    client: 'h5' | 'pc' | 'app';
  };
  [TrackType.USER_LOGOUT]: {
    userId: string;
    time: string;
    client: 'h5' | 'pc' | 'app';
  };
  [TrackType.PRODUCT_COLLECTION]: {
    productId: string;
    userId: string;
    time: string;
  };
  [TrackType.COMMENT]: {
    description: string;
    userId: string;
    time: string;
  };
  [TrackType.CHECKOUT]: {
    productId: string;
    quantity: number;
    userId: string;
    time: string;
  };
  [TrackType.ADD_TO_CART]: {
    productId: string;
    quantity: number;
    userId: string;
    time: string;
  };
  [TrackType.PAGE_STAY]: {
    url: string;
    duration: number;
    userId: string;
    time: string;
  };
};

type Only<T> = {
  [P in keyof T]: T[P];
};

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

interface TrackData {
  event: string;
  data: Record<string, any>;
  timestamp: number;
  url: string;
  ua: string;
  userId?: string;
}

function isTrack(value: string): value is TrackType {
  return Object.values<string>(TrackType).includes(value);
}

class Tracker {
  private reportUrl: string;
  private queue:  RequireOnlyOne<TrackContent>[] = [];
  private batchSize: number;
  private batchInterval: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private userId?: string;

  constructor({ reportUrl, batchSize = 5, batchInterval = 5000, userId }: TrackerConfig) {
    this.reportUrl = reportUrl;
    this.batchSize = batchSize;
    this.batchInterval = batchInterval;
    this.userId = userId;

    this.initAutoTracking();
    this.startBatchTimer();
    this.reportPageView();

    window.addEventListener('beforeunload', () => this.flush());
  }

  private initAutoTracking() {
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement)?.closest('[data-track]');
      if (target) {
        // this.track(target.getAttribute('data-track')!, {
        //   text: target.textContent?.trim(),
        // });
        this.track(target.getAttribute('data-track')!, JSON.parse(target.getAttribute('data-content')!));
      }
    });
  }

  private reportPageView() {
    this.track('page_view', { path: window.location.pathname });
  }

  public track(event: string, data: Record<string, any> = {}) {
    if (!isTrack(event)) return;
    
    const payload = {
      [event]: {
        ...data,
        userId: this.userId,
        time: dayjs(Date.now()).format('YYYY-MM-DD HH:mm')
      },
    };

    console.log(payload);
    // const payloadd: TrackData = {
    //   event,
    //   data,
    //   timestamp: Date.now(),
    //   url: location.href,
    //   ua: navigator.userAgent,
    //   userId: this.userId,
    // };

    this.queue.push(payload as any);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  private startBatchTimer() {
    this.timer = setInterval(() => this.flush(), this.batchInterval);
  }

  private flush() {
    if (this.queue.length == 0) return;

    const batch = [...this.queue];
    this.queue = [];

    // if (navigator.sendBeacon!) {
    //     console.log('sendBeaconsendBeaconsendBeacon')
    //   navigator.sendBeacon(this.reportUrl, JSON.stringify(batch));
    // } else {
    postService.submitTrack({ data: batch });
    //}
  }
}

let trackInstance: Tracker | null = null;

export function initTracker(config: TrackerConfig) {
  const aa: RequireOnlyOne<TrackContent> = {
    [TrackType.PAGE_STAY]: {
      url: 'ww',
      duration: 10 * 1000,
      userId: 'aaa',
      time: '2022-10-15',
    },
  };
  if (!trackInstance) {
    trackInstance = new Tracker(config);
  }
  return trackInstance;
}

export function track(event: string, data?: Record<string, any>) {
  if (!trackInstance) {
    console.warn('tracker 未初始化');
    return;
  }
  trackInstance.track(event, data);
}
