/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-08 23:44:46
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-27 15:46:18
 * @FilePath: /nextjs/travel-dairy/src/app/@sidemenu/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import getAllPersons from '@/app/actions/getAllPersons';
import executeFn from '@/app/actions/executeFn';
import { db } from '@/drizzle/db';
import { NewUser, users, NewPost, posts } from '@/drizzle/schema';

const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user).returning();
};

const insertPost = async (post: NewPost) => {
  return db.insert(posts).values(post).returning();
};

const getPost = async () => {
  return db.query.posts.findFirst({
    with: {
      author: true,
    },
  });
};

const newPost: NewPost = {
  content: 'this is fsff',
  authorId: '896ec2eb-41d9-4f0a-977b-35044a0fa671',
};

const newUser: NewUser = {
  name: 'test2',
  email: 'sfwerwrewr.com',
  password: 'rwrqrr',
};

const Setting = async () => {
  const persons = await getAllPersons();
  const data = await executeFn();
  const user = await getPost();

  console.log(user);

  return <div>APP setting</div>;
};

export default Setting;
