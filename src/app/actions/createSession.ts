/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-10 17:27:46
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-10 17:27:49
 * @FilePath: /travel-dairy/src/app/actions/createSession.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use server';
import { createAdminClient } from '@/config/appwrite';
import { cookies } from 'next/headers';

async function createSession(previousState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return {
      error: 'Please fill out all fields',
    };
  }

  // Get account instance
  const { account } = await createAdminClient();

  try {
    //  Generate session
    const session = await account.createEmailPasswordSession(email  as any, password as any);

    // Create cookie
    cookies().set('appwrite-session', session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(session.expire),
      path: '/',
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log('Authentication Error: ', error);
    return {
      error: 'Invalid Credentials',
    };
  }
}

export default createSession;
