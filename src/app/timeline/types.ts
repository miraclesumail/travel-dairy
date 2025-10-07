export type TimelineOrientation = 'vertical' | 'horizontal';

export interface TimelineItemData {
  id: string | number;
  title: string;
  date?: string;             // 显示的时间，格式自由
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;    // 可传图标
  color?: string;            // dot 的背景色（Tailwind 色类或自定义）
}