/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-08 21:51:03
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-08 21:51:17
 * @FilePath: /travel-dairy/src/app/screenshot/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import React, { useRef, useState } from "react";
import ScreenshotSelector from "./demo";

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [toolOpen, setToolOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold mb-4">区域截图演示</h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setToolOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          打开截图工具（选择页面区域）
        </button>
        <button
          onClick={() => {
            // 也可以在不传 containerRef 时捕获整页
            setToolOpen(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          打开（捕获整页）
        </button>
      </div>

      <div
        ref={containerRef}
        className="border rounded p-6 bg-white shadow-sm"
      >
        <h2 className="text-lg font-medium">这是可捕获的容器</h2>
        <p className="mt-2 text-gray-600">
          你可以在这个区域内选择任意矩形，导出为图片。包含文字、样式、图片等（注意跨域图片可能无法导出）。
        </p>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="h-24 bg-gradient-to-r from-purple-300 to-purple-500 rounded" />
          <div className="h-24 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded" />
          <div className="h-24 bg-gradient-to-r from-green-300 to-green-500 rounded" />
        </div>
      </div>

      {/* 工具覆盖 containerRef（若未传入 ref，则默认捕获 body） */}
      {toolOpen && (
        <ScreenshotSelector
          containerRef={containerRef}
          visible={toolOpen}
          onClose={() => setToolOpen(false)}
          filename="my-capture"
        />
      )}
    </div>
  );
};

export default App;