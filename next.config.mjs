/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-02 16:10:47
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-12-10 23:53:27
 * @FilePath: /nextjs/travel-dairy/next.config.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false,
   webpack: (config, options) => {
      config.module.rules.push({
         test: /\.mp3$/,
         use: {
           loader: 'file-loader',
         },
       });
       return config;
   },
   images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
        },
      ],
    },
};

export default nextConfig;
