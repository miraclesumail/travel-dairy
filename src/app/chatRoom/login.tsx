/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-10-18 22:09:32
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-10-19 17:52:03
 * @FilePath: /travel-dairy/src/app/chatRoom/login.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState } from 'react';
import { userService } from '../service';

export default function LoginPage({ setToken, setUsername: setname }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  async function handleSubmit() {
    try {
      const res: any = isLogin
        ? await userService.login({ username, password })
        : await userService.register({ username, password });

      localStorage.setItem('token', res.token);
      localStorage.setItem('username', res.username);
      setToken(res.token);
      setname(res.username);
    } catch (err) {
      alert('登录失败');
    }
  }

  return (
    <div className='flex h-screen justify-center items-center bg-gray-100'>
      <div className='bg-white p-6 rounded shadow-md w-80'>
        <h2 className='text-xl font-bold mb-4 text-center'>{isLogin ? '登录' : '注册'}</h2>
        <input
          className='border w-full mb-2 px-3 py-2 rounded'
          placeholder='用户名'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className='border w-full mb-4 px-3 py-2 rounded'
          placeholder='密码'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit} className='bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600'>
          {isLogin ? '登录' : '注册'}
        </button>
        <p className='text-sm text-blue-500 text-center mt-2 cursor-pointer' onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? '没有账号？注册' : '已有账号？登录'}
        </p>
      </div>
    </div>
  );
}
