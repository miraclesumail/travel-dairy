/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-08 21:08:41
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-08 21:10:55
 * @FilePath: /travel-dairy/src/app/popup/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import React, { useState } from "react";
import Popup from "./demo";

const App: React.FC = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <button
        onClick={() => setVisible(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        打开底部弹出层
      </button>

      <Popup
        visible={visible}
        onClose={() => setVisible(false)}
        direction="bottom"
        duration={300}
      >
        <div className="p-4">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-2">我是底部弹窗</h2>
          <h2 className="text-lg font-semibold mb-2">我是底部弹窗</h2>
          <h2 className="text-lg font-semibold mb-2">我是底部弹窗</h2>
          <h2 className="text-lg font-semibold mb-2">我是底部弹窗</h2>
          <h2 className="text-lg font-semibold mb-2">我是底部弹窗</h2>
          <h2 className="text-lg font-semibold mb-2">我是底部弹窗</h2>
          <p className="text-gray-600 text-sm mb-4">
            支持手势下滑关闭和点击遮罩关闭～
          </p>
          <button
            onClick={() => setVisible(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            关闭
          </button>
        </div>
      </Popup>
    </div>
  );
};

export default App;