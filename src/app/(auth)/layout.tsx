/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-02 16:35:42
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-07-02 16:37:25
 * @FilePath: /nextjs/travel-dairy/src/app/(auth)/layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div>
        <div>Auth layout</div>
        {children}
      </div>
    );
  }