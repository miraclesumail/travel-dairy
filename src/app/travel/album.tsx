/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-08 15:14:01
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-09-14 02:20:46
 * @FilePath: /nextjs/travel-dairy/src/app/travel/album.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { use } from "@/app/utils";
import { fetchData } from "@/app/utils/data";

export default async function Albums({ artistId }: any) {
  const albums = await fetchData(`/${artistId}/albums`);

  console.log(albums)

  return (
    <ul>
      {albums.map((album: any) => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
