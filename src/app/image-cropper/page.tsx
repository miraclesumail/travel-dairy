'use client';
import { StaticImageData } from 'next/image';
import { LegacyRef, MutableRefObject, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useDrag, useGesture } from '@use-gesture/react';
import { useMotionValue, motion, animate } from 'motion/react';
import Img from './test.jpg';
import { cn } from '@/lib/utils';

type CropperProps = {
  src: string;
  classname?: string;
  width: number;
  height: number;
};

enum Status {
  LOADING,
  VALID,
  INVALID,
}

export default function Page() {
  return (
    <Cropper
      src={Img.src}
      width={300}
      height={300}
      classname='overflow-hidden flex flex-row items-center justify-center mx-auto'
    />
  );
}

const Cropper = ({ src, width, height, classname }: CropperProps) => {
  let [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });
  let [way, setWay] = useState<any>(null);

  let x = useMotionValue(crop.x);
  let y = useMotionValue(crop.y);
  let scale = useMotionValue(crop.scale);
  const [status, setStatus] = useState<Status>(Status.LOADING);
  const imageRef = useRef<HTMLImageElement>();
  let imageContainerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setStatus(Status.VALID);
      console.log(img.width, '---', img.height);

      const wRatio = img.width / width;
      const hRatio = img.height / height;

      setWay(wRatio >= hRatio ? 1 : 2);
    };

    img.src = src;
  }, []);

  console.log('render---');

  useGesture(
    {
      onDrag: ({ down, movement: [mx, my] }) => {
        const { minX, minY, maxX, maxY } = getLimitedTranslateXY();

        x.set(dampen(crop.x + mx, [minX, maxX]));
        y.set(dampen(crop.y + my, [minY, maxY]));
      },
      onPinch: ({ offset: [d], memo, origin: [pinchOriginX, pinchOriginY] }) => {
        memo ??= {
          bounds: imageRef.current?.getBoundingClientRect(),
          crop: { x: x.get(), y: y.get(), scale: scale.get() },
        };

        let transformOriginX = memo.bounds.x + memo.bounds.width / 2;
        let transformOriginY = memo.bounds.y + memo.bounds.height / 2;

        console.log(transformOriginX, 'containerBounds');

        let displacementX = (transformOriginX - pinchOriginX) / memo.crop.scale;
        let displacementY = (transformOriginY - pinchOriginY) / memo.crop.scale;

        let initialOffsetDistance = (memo.crop.scale - 1) * 200;
        let movementDistance = d - initialOffsetDistance;

        scale.set(1 + d / 8);

        x.set(memo.crop.x + (displacementX * movementDistance) / 200);
        y.set(memo.crop.y + (displacementY * movementDistance) / 200);

        return memo;
      },
      // onDragEnd: () => setCrop((crop) => ({ ...crop, x: x.get(), y: y.get() })),
      onDragEnd: maybeAdjustImage,
    },
    {
      // drag: {
      //   bounds: (state) => {
      //     console.log(imageRef.current?.getBoundingClientRect());
      //     const { width: W, height: H } = imageRef.current?.getBoundingClientRect()! || {};

      //     return { top: -(H - 300) / 2, bottom: (H - 300) / 2, left: -(W - 300) / 2, right: (W - 300) / 2 };
      //   },
      // },
      target: document.querySelector('#testimg') as any,
      eventOptions: { passive: false },
    }
  );

  function getLimitedTranslateXY() {
    let imageBounds = imageRef.current?.getBoundingClientRect();
    let containerBounds = imageContainerRef.current?.getBoundingClientRect();

    // 水平方向最大x
    const maxX = (imageBounds?.width! - containerBounds?.width!) / 2;
    const minX = -(imageBounds?.width! - containerBounds?.width!) / 2;
    const maxY = (imageBounds?.height! - containerBounds?.height!) / 2;
    const minY = -(imageBounds?.height! - containerBounds?.height!) / 2;

    return {
      maxX,
      minX,
      maxY,
      minY,
    };
  }

  function maybeAdjustImage() {
    let newCrop = { x: x.get(), y: y.get(), scale: scale.get() };
    let imageBounds = imageRef.current?.getBoundingClientRect();
    let containerBounds = imageContainerRef.current?.getBoundingClientRect();

    const { minX, minY, maxX, maxY } = getLimitedTranslateXY();

    if (imageBounds?.left! > containerBounds?.left!) {
      newCrop.x = maxX;
    } else if (imageBounds?.right! < containerBounds?.right!) {
      newCrop.x = minX;
    }

    if (imageBounds?.top! > containerBounds?.top!) {
      newCrop.y = maxY;
    } else if (imageBounds?.bottom! < containerBounds?.bottom!) {
      newCrop.y = minY;
    }

    animate(x, newCrop.x, {
      type: 'tween',
      duration: 0.2,
      ease: [0.25, 1, 0.5, 1],
    });

    animate(y, newCrop.y, {
      type: 'tween',
      duration: 0.2,
      ease: [0.25, 1, 0.5, 1],
    });

    setCrop(newCrop);
  }

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }} className={classname} ref={imageContainerRef as any}>
      {status == Status.LOADING && <div>loading</div>}

      {status == Status.VALID && (
        <motion.img
          src={src}
          ref={imageRef as any}
          id='testimg'
          className={cn('relative  max-w-none max-h-none origin-center', way == 1 ? 'w-auto h-full' : 'w-full h-auto')}
          style={
            {
              x: x,
              y: y,
              scale: scale,
              touchAction: 'none',
              userSelect: 'none',
              MozUserSelect: 'none',
              WebkitUserDrag: 'none',
            } as any
          }
        />
      )}
    </div>
  );
};

function dampen(val: number, [min, max]: number[]) {
  if (val > max) {
    let extra = val - max;
    let dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
    return max + dampenedExtra * 2;
  } else if (val < min) {
    let extra = val - min;
    let dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
    return min + dampenedExtra * 2;
  } else {
    return val;
  }
}
