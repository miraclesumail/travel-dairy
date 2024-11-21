/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-24 17:34:38
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-24 18:13:50
 * @FilePath: /travel-dairy/drizzle.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import '@/drizzle/envConfig';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/drizzle/schema/index.ts',
    dialect: "postgresql",
    dbCredentials: {
      url: process.env.DATABASE_URL!,
    },
  });
