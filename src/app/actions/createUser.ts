/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-10 17:32:58
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-10 17:33:03
 * @FilePath: /travel-dairy/src/app/actions/createUser.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use server';
import { createAdminClient } from '@/config/appwrite';
import { ID } from 'node-appwrite';

async function createUser(previousState: any, formData: any) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm-password');

  if (!email || !name || !password) {
    return {
      error: 'Please fill in all fields',
    };
  }

  if (password.length < 8) {
    return {
      error: 'Password must be at least 8 characters long',
    };
  }

  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match',
    };
  }

  // Get account instance
  const { account } = await createAdminClient();

  try {
    // Create user
    await account.create(ID.unique(), email, password, name);

    return {
      success: true,
    };
  } catch (error) {
    console.log('Registration Error: ', error);
    return {
      error: 'Could not register user',
    };
  }
}

export default createUser;
