/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-24 18:10:36
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-24 18:10:45
 * @FilePath: /travel-dairy/src/drizzle/db.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema, logger: true })