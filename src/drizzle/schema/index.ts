/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-24 17:53:00
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-27 15:18:00
 * @FilePath: /travel-dairy/src/drizzle/schema/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE/pg
 */
import { integer, pgTable, serial, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { InferInsertModel, relations } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx').on(users.email),
    };
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content'),
  authorId: uuid('author_id').references(() => users.id),
});

export const postRelatons = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

export type NewUser = InferInsertModel<typeof users>;
export type NewPost = InferInsertModel<typeof posts>;
