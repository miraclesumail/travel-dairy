/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-02 16:10:47
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-12-01 20:45:45
 * @FilePath: /nextjs/travel-dairy/next.config.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactStrictMode: false,
  output: 'export', // 关键配置：开启静态导出

  webpack: (config, options) => {
    console.log(process.env.NEXT_PUBLIC_APPWRITE_DATABASE, 'hahahah');
    config.module.rules.push({
      test: /\.mp3$/,
      use: {
        loader: 'file-loader',
      },
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      '@theme': path.resolve(__dirname, `src/themes/${process.env.THEME}`),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    unoptimized: true, // GitHub Pages 不支持 Next 自带的图片优化，必须关闭
  },
};

export default nextConfig;
