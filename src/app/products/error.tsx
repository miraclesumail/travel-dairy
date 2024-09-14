/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-04 14:13:20
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-07-04 14:24:20
 * @FilePath: /nextjs/travel-dairy/src/app/products/[productId]/error.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client' // Error components must be Client Components

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div>
      <h2>this is parent error</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
