import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  duration?: number;
  height?: number;
};

type DotRenderInfo = {
  id: number;
  x: number;
  y: number;
};

type FlyDot = {
  id: number;
  x0: number;
  y0: number;
  cx: number;
  cy: number;
  x1: number;
  y1: number;
  startTime: number;
  duration: number;
};

export function useFly(options?: Options) {
  const { duration = 600, height = -80 } = options || {};
  const [dots, setDots] = useState<FlyDot[]>([]);
  const [renderDots, setRenderDots] = useState<DotRenderInfo[]>([]);
  const dotsRef = useRef<FlyDot[]>(dots);
  const idRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const addFly = (fromEl: HTMLElement, toEl: HTMLElement) => {
    const fromRect = fromEl.getBoundingClientRect();
    const endRect = toEl.getBoundingClientRect();

    // [x,y] of the start point
    const x0 = fromRect.left + fromRect.width / 2;
    const y0 = fromRect.top + fromRect.height / 2;

    // [x,y] of the end point
    const x1 = endRect.left + endRect.width / 2;
    const y1 = endRect.top + endRect.height / 2;

    // control point
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2 + height;

    const id = idRef.current++;

    const dot: FlyDot = {
      id,
      x0,
      y0,
      cx,
      cy,
      x1,
      y1,
      startTime: performance.now(),
      duration,
    };

    setDots((prev) => [...prev, dot]);
  };

  const removeDot = (id: number) => setDots((prev) => prev.filter((d) => d.id != id));

  useEffect(() => {
    dotsRef.current = dots;
  }, [dots]);

  useEffect(() => {
    const animate = () => {
      const now = performance.now();
      const newRenderDots: DotRenderInfo[] = [];

      for (const dot of dotsRef.current) {
        const { id, x0, y0, cx, cy, x1, y1, startTime, duration } = dot;

        const elapsed = now - startTime;
        let t = elapsed / duration;

        if (t >= 1) {
          removeDot(id);
          continue;
        }

        if (t < 0) t = 0;

        const oneMinusT = 1 - t;
        // calculate the [x,y] of the moving dot
        const x = oneMinusT * oneMinusT * x0 + 2 * oneMinusT * t * cx + t * t * x1;
        const y = oneMinusT * oneMinusT * y0 + 2 * oneMinusT * t * cy + t * t * y1;

        newRenderDots.push({ id, x, y });
      }

      setRenderDots(newRenderDots);

      if (dotsRef.current.length) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    if (dots.length && animationRef.current == null) animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current != null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [dots.length]);

  const FlyLayer: React.FC = useCallback(() => {
    if (renderDots.length === 0) return null;

    return (
      <>
        {renderDots.map((dot) => (
          <div
            key={dot.id}
            className="fixed z-50 pointer-events-none"
            style={{
              left: dot.x,
              top: dot.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* 这里可以按需换成图片 / Icon / SVG */}
            <div className="w-3 h-3 rounded-full bg-rose-500 shadow" />
          </div>
        ))}
      </>
    );
  }, [renderDots]);

  return {
    addFly,
    FlyLayer,
  };
}

