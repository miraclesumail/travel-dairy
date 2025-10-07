/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-07 22:47:33
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-08 00:02:55
 * @FilePath: /travel-dairy/src/app/musicPlay/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import MusicPlayerPro from './player';

function App() {
  const playlist = [
    {
      title: '晴天',
      artist: '周杰伦',
      src: 'https://er-sycdn.kuwo.cn/df3d656767bfb890eef1b711908eaef3/68e51cad/resource/30106/trackmedia/M5000039MnYb0qxYhV.mp3',
      cover: 'http://img2.kuwo.cn/star/albumcover/500/s3s94/93/211513640.jpg',
    },
    {
      title: '神话',
      artist: '成龙 金喜善',
      src: 'https://er-sycdn.kuwo.cn/906d54f85be1b24e3ab26c3bcbfa2ed4/68e52cb9/resource/30106/trackmedia/M500003OMMaE1rTbDH.mp3',
      cover: 'https://i.scdn.co/image/ab67616d0000b2733d25dbd3d2eab76a0e50e0e0',
    },
    {
      title: '只要有你',
      artist: '孙楠 那英',
      src: 'https://ra-sycdn.kuwo.cn/37552bd49b7a56602fc7a3f91836b18b/68e518d2/resource/n1/128/84/57/3815777630.mp3',
      cover: 'https://inews.gtimg.com/news_bt/ONOlKR7HXbpAZsLbCO9GIMNxqghdA2ujcWThnf3_EZSRAAA/1000',
    },
    {
      title: '太多',
      artist: '陈冠蒲',
      src: 'https://ek-sycdn.kuwo.cn/648c1324d898a26a4973459329530e76/68e52f87/resource/n3/59/9/2953565008.mp3',
      cover: 'http://img1.kuwo.cn/star/albumcover/500/5/63/3732364662.jpg',
    },
    {
      title: 'I want it that way',
      artist: '后街男孩',
      src: 'https://ra-sycdn.kuwo.cn/96716b90f701020fb4c39d58b89dc82f/68e538d0/resource/n3/128/22/12/4155190692.mp3',
      cover: 'http://img3.kuwo.cn/star/albumcover/500/36/85/1091039134.jpg',
    },
    {
      title: '暗香',
      artist: '沙宝亮',
      src: 'https://er-sycdn.kuwo.cn/b2db1ccf4ca604470403bb0c5cc0b77b/68e51ff8/resource/30106/trackmedia/M5000016vmnO1ZGck1.mp3',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn2_ql8JkNhBN2HUcVxIch1lMFXIakAtuSeg&s',
    },
    // https://er-sycdn.kuwo.cn/b2db1ccf4ca604470403bb0c5cc0b77b/68e51ff8/resource/30106/trackmedia/M5000016vmnO1ZGck1.mp3
    // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn2_ql8JkNhBN2HUcVxIch1lMFXIakAtuSeg&s
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-950 to-gray-800 flex items-center justify-center'>
      <MusicPlayerPro playlist={playlist} />
    </div>
  );
}

export default App;
