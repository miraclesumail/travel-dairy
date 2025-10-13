import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";

type Direction = "top" | "bottom" | "left" | "right" | "center";

interface PopupProps {
  visible: boolean;
  onClose: () => void;
  direction?: Direction;
  duration?: number; // 动画时长（ms）
  children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({
  visible,
  onClose,
  direction = "bottom",
  duration = 300,
  children,
}) => {
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [dragging, setDragging] = useState(false);

  // 禁止背景滚动
  useEffect(() => {
    if (visible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  // 延迟挂载 portal 节点
  useEffect(() => {
    setMounted(true);
  }, []);

  // 触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    if (direction !== "bottom" && direction !== "top") return;
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    setDragging(true);
  };

  // 触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || !popupRef.current) return;
    const moveY = e.touches[0].clientY;
    currentY.current = moveY;
    const delta = moveY - startY.current;

    // bottom 弹窗：下滑
    if (direction === "bottom" && delta > 0) {
      popupRef.current.style.transform = `translateY(${delta}px)`;
    }

    // top 弹窗：上滑
    if (direction === "top" && delta < 0) {
      popupRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  // 触摸结束
  const handleTouchEnd = () => {
    if (!dragging || !popupRef.current) return;
    const delta = currentY.current - startY.current;
    setDragging(false);

    const threshold = 100; // 滑动关闭阈值

    // 判断是否关闭
    if (
      (direction === "bottom" && delta > threshold) ||
      (direction === "top" && delta < -threshold)
    ) {
      onClose();
    } else {
      // 回弹
      popupRef.current.style.transition = `transform ${duration}ms ease`;
      popupRef.current.style.transform = `translateY(0)`;
      setTimeout(() => {
        if (popupRef.current) popupRef.current.style.transition = "";
      }, duration);
    }
  };

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center transition-all",
        visible ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* 遮罩层 */}
      <div
        className={clsx(
          "absolute inset-0 bg-black/50 transition-opacity",
          visible ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDuration: `${duration}ms` }}
        onClick={onClose}
      />

      {/* 内容层 */}
      <div
        ref={popupRef}
        className={clsx(
          "absolute bg-white shadow-lg transition-transform",
          "max-h-[90vh] overflow-auto",
          direction === "bottom" && "left-0 right-0 bottom-0 rounded-t-lg",
          direction === "top" && "left-0 right-0 top-0 rounded-b-lg",
          direction === "left" && "left-0 top-0 bottom-0 w-3/4 max-w-sm",
          direction === "right" && "right-0 top-0 bottom-0 w-3/4 max-w-sm",
          direction === "center" && "rounded-lg p-4"
        )}
        style={{
          transitionDuration: `${duration}ms`,
          transform: visible
            ? "translate(0, 0)"
            : {
                bottom: "translateY(100%)",
                top: "translateY(-100%)",
                left: "translateX(-100%)",
                right: "translateX(100%)",
                center: "scale(0.8)",
              }[direction],
          opacity: direction === "center" ? (visible ? 1 : 0) : 1,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Popup;