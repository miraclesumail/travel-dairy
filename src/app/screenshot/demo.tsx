import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

type ImageFormat = 'png' | 'jpeg';

interface ScreenshotSelectorProps {
  /**
   * 容器元素：若未提供则捕获整个 document.body
   * 传入一个 ref（HTMLDivElement 或其他容器）
   */
  containerRef?: React.RefObject<HTMLElement>;
  /** 是否显示选择工具（由外部控制） */
  visible?: boolean;
  /** 关闭时回调 */
  onClose?: () => void;
  /** 默认导出文件名（不含后缀） */
  filename?: string;
}

const ScreenshotSelector: React.FC<ScreenshotSelectorProps> = ({
  containerRef,
  visible = false,
  onClose,
  filename = 'screenshot',
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [showUI, setShowUI] = useState(visible);
  const [format, setFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState<number>(0.92); // jpeg quality

  useEffect(() => {
    setShowUI(visible);
  }, [visible]);

  console.log(rect, 'reeee---');

  // 绑定 ESC 取消
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelSelection();
      }
    };
    if (showUI) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showUI]);

  const getContainer = (): HTMLElement => {
    return containerRef?.current ?? (document.body as HTMLElement);
  };

  const pageToContainer = (pageX: number, pageY: number) => {
    const container = getContainer();
    const br = container.getBoundingClientRect();
    // convert page coords to container-relative coords
    const x = pageX - br.left - window.scrollX;
    const y = pageY - br.top - window.scrollY;
    return { x, y, br };
  };

  function onMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return; // only left click
    e.preventDefault();

    console.log('aaaa-----');
    const { x, y } = pageToContainer(e.pageX, e.pageY);
    startRef.current = { x, y };
    setRect({ x, y, w: 0, h: 0 });
    setSelecting(true);
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!selecting || !startRef.current) return;
    e.preventDefault();
    const { x: sx, y: sy } = startRef.current;
    const { x: cx, y: cy } = pageToContainer(e.pageX, e.pageY);
    const x = Math.min(sx, cx);
    const y = Math.min(sy, cy);
    const w = Math.max(0, Math.abs(cx - sx));
    const h = Math.max(0, Math.abs(cy - sy));
    setRect({ x, y, w, h });
  }

  function onMouseUp(e: React.MouseEvent) {
    if (!selecting) return;
    e.preventDefault();
    setSelecting(false);
    startRef.current = null;
  }

  function cancelSelection() {
    setRect(null);
    setSelecting(false);
    startRef.current = null;
    setShowUI(false);
    onClose?.();
  }

  async function saveSelection(asFormat: ImageFormat) {
    if (!rect || rect.w === 0 || rect.h === 0) {
      alert('请先用鼠标拖拽选择区域。');
      return;
    }

    const container = getContainer();
    // 使用 html2canvas 渲染容器
    // 选项可根据需要调整：useCORS, scale (提高分辨率)
    const scale = Math.min(2, window.devicePixelRatio || 1); // 适当提升像素密度
    const canvas = await html2canvas(container, {
      useCORS: true,
      scale,
      backgroundColor: undefined, // 保持透明（若需要）
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
    });

    // 因为 html2canvas 使用了 scale，需把坐标放大
    const sx = Math.round(rect.x * scale);
    const sy = Math.round(rect.y * scale);
    const sw = Math.round(rect.w * scale);
    const sh = Math.round(rect.h * scale);

    // 新画布用于裁切
    const out = document.createElement('canvas');
    out.width = sw;
    out.height = sh;
    const ctx = out.getContext('2d');
    if (!ctx) {
      alert('无法创建画布上下文。');
      return;
    }
    ctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);

    // 导出
    const mime = asFormat === 'png' ? 'image/png' : 'image/jpeg';
    const dataUrl = out.toDataURL(mime, asFormat === 'jpeg' ? quality : 1);
    triggerDownload(dataUrl, `${filename}.${asFormat === 'png' ? 'png' : 'jpg'}`);

    // 关闭工具或保留（这里我们保留选区，用户可以再导出）
    // setRect(null);
    // setShowUI(false);
  }

  function triggerDownload(dataUrl: string, fileName: string) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  if (!showUI) return null;

  // overlay size/position must match container
  const container = getContainer();
  const br = container.getBoundingClientRect();
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${br.left + window.scrollX}px`,
    top: `${br.top + window.scrollY}px`,
    width: `${br.width}px`,
    height: `${br.height}px`,
    zIndex: 9999,
    cursor: selecting ? 'crosshair' : 'crosshair',
  };

  return (
    <>
      <div
        ref={overlayRef}
        className='fixed inset-0 z-[9999]'
        style={{ pointerEvents: 'auto' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {/* 半透明遮罩覆盖整个视窗 */}
        <div className='absolute inset-0 bg-black/30' />

        {/* 精确匹配容器位置的透明区域（用于定位相对坐标） */}
        <div style={overlayStyle} />

        {/* 选区矩形 */}
        {rect && (
          <>
            {/* 剪裁矩形可视化 */}
            <div
              className='absolute border-2 border-dashed border-white bg-white/10'
              style={{
                left: overlayStyle.left ? `calc(${overlayStyle.left} + ${rect.x}px)` : rect.x,
                top: overlayStyle.top ? `calc(${overlayStyle.top} + ${rect.y}px)` : rect.y,
                width: rect.w,
                height: rect.h,
                boxSizing: 'border-box',
                pointerEvents: 'none',
              }}
            />

            {/* 大小提示 */}
            <div
              className='absolute bg-black/70 text-white text-xs px-2 py-1 rounded'
              style={{
                left: overlayStyle.left ? `calc(${overlayStyle.left} + ${rect.x}px)` : rect.x,
                top: overlayStyle.top ? `calc(${overlayStyle.top} + ${rect.y - 30}px)` : rect.y - 30,
                pointerEvents: 'none',
              }}
            >
              {rect.w}px × {rect.h}px
            </div>
          </>
        )}

        {/* 工具条（固定在右上角） */}
      </div>
      <div className='fixed right-4 top-4 z-[1000000]'>
        <div className='bg-white/95 backdrop-blur-sm border rounded-md shadow p-3 flex flex-col gap-2 w-56'>
          <div className='flex items-center justify-between'>
            <div className='text-sm font-medium text-gray-700'>截图工具</div>
            <button onClick={cancelSelection} className='text-sm text-gray-500 hover:text-gray-800' title='关闭 (Esc)'>
              关闭
            </button>
          </div>

          <div className='flex items-center gap-2'>
            <label className='text-xs text-gray-600'>格式</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ImageFormat)}
              className='ml-auto rounded border px-2 py-1 text-sm'
            >
              <option value='png'>PNG</option>
              <option value='jpeg'>JPG</option>
            </select>
          </div>

          {format === 'jpeg' && (
            <div className='flex items-center gap-2'>
              <label className='text-xs text-gray-600'>质量</label>
              <input
                type='range'
                min={0.3}
                max={1}
                step={0.01}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className='ml-auto'
              />
            </div>
          )}

          <div className='flex gap-2'>
            <button
              onClick={() => saveSelection(format)}
              className='flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded'
            >
              保存为 {format === 'png' ? 'PNG' : 'JPG'}
            </button>
            <button
              onClick={() => {
                setRect(null);
              }}
              className='flex-1 border border-gray-200 text-sm px-3 py-2 rounded'
            >
              重选
            </button>
          </div>

          <div className='text-xs text-gray-500'>
            使用说明：按下左键并拖拽选择区域 → 松开鼠标确认 → 点击保存。Esc 取消。
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenshotSelector;
