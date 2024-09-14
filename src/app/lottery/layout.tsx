/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-08 15:36:31
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-07-08 15:38:03
 * @FilePath: /nextjs/travel-dairy/src/app/lottery/layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default function Layout({
  children,
  team,
  description,
}: {
  children: React.ReactNode;
  description: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <>
      {children}
      {team}
      {description}
    </>
  );
}
