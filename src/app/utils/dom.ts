type VerticalPoint = 'top' | 'center' | 'bottom';

interface VerticalDistanceOptions {
  childPoint?: VerticalPoint;
  parentPoint?: VerticalPoint;
}

/**
 * 计算子元素相对于父元素内容框（content box）顶部的垂直距离（px）
 * 不计算父元素的 margin 和 padding（以父元素 content-box 为基准）
 *
 * @param child 子元素（必须是 DOM Element）
 * @param parent 父元素（必须为 child 的祖先）
 * @param opts 选项：子元素和父元素取哪个参考点（top/center/bottom）
 * @returns 像素距离（childPoint 相对于 parentPoint 的垂直偏移，向下为正）
 */
export function verticalDistanceExcludingParentPaddingMargin(
  child: Element,
  parent: Element,
  opts: VerticalDistanceOptions = {}
): number {
  if (!(child instanceof Element) || !(parent instanceof Element)) {
    throw new TypeError('child 和 parent 必须是 DOM 元素');
  }

  const { childPoint = 'top', parentPoint = 'top' } = opts;

  const childRect = child.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const style = getComputedStyle(parent);

  // 解析 border 和 padding（px 值）
  const borderTop = parseFloat(style.borderTopWidth) || 0;
  const borderBottom = parseFloat(style.borderBottomWidth) || 0;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const paddingBottom = parseFloat(style.paddingBottom) || 0;

  // 父元素 content-box 顶部/底部/中点（基于视口坐标）
  const parentContentTop = parentRect.top + borderTop + paddingTop;
  const parentContentBottom = parentRect.bottom - borderBottom - paddingBottom;
  const parentContentCenter = (parentContentTop + parentContentBottom) / 2;

  // 子元素参考点（基于视口坐标）
  let childPointY: number;
  switch (childPoint) {
    case 'top':
      childPointY = childRect.top;
      break;
    case 'bottom':
      childPointY = childRect.bottom;
      break;
    case 'center':
      childPointY = (childRect.top + childRect.bottom) / 2;
      break;
    default:
      // 使用 never 让 TS 在出现非法值时报错
      const _exhaustChild: never = childPoint;
      throw new Error('opts.childPoint 必须是 top | center | bottom');
  }

  // 父元素参考点 Y
  let parentPointY: number;
  switch (parentPoint) {
    case 'top':
      parentPointY = parentContentTop;
      break;
    case 'bottom':
      parentPointY = parentContentBottom;
      break;
    case 'center':
      parentPointY = parentContentCenter;
      break;
    default:
      const _exhaustParent: never = parentPoint;
      throw new Error('opts.parentPoint 必须是 top | center | bottom');
  }

  // 返回差值（单位 px），视口坐标下的差值与文档滚动无关
  return childPointY - parentPointY;
}