'use client';
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import dayjs from 'dayjs';

type ChatMessage = {
  id: string;
  user: string;
  text: string;
  time: string; // ISO string
};

let socket: Socket | null = null;

function connectToServer(serverUrl = 'http://localhost:4000') {
  if (!socket) {
    socket = io(serverUrl, { transports: ['websocket', 'polling'] });
  }
  return socket;
}

export default function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState(() => {
    // 从 localStorage 读 username，若无则生成匿名提示
    const saved = localStorage.getItem('chat_username');
    return saved ?? `User${Math.floor(Math.random() * 9000 + 1000)}`;
  });

  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const s = connectToServer();
    s.on('connect', () => {
      setConnected(true);
      console.log('已连接，socket id:', s.id);
    });

    s.on('disconnect', () => {
      setConnected(false);
    });

    s.on('history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    s.on('message', (msg: ChatMessage) => {
      console.log(msg, 'from server');
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.off('connect');
      s.off('disconnect');
      s.off('history');
      s.off('message');
      // 不主动断开单页面多实例可能共享 socket，若需干净断开可:
      // s.close();
    };
  }, []);

  // 自动滚到底部
  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const s = socket;
    if (!s) return;

    s.emit('message', { user: username, text: input.trim() });
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const saveName = () => {
    localStorage.setItem('chat_username', username);
  };

  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <header className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='text-xl font-semibold'>💬 实时聊天室</div>
          <div
            className={`px-2 py-0.5 rounded text-xs ${
              connected ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}
          >
            {connected ? '已连接' : '未连接'}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <input
            className='text-sm px-2 py-1 rounded border focus:outline-none'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={saveName}
          />
          <button onClick={saveName} className='text-sm bg-white/20 px-3 py-1 rounded'>
            保存
          </button>
        </div>
      </header>

      <main className='flex-1 overflow-hidden flex'>
        <div ref={chatRef} className='flex-1 p-4 overflow-y-auto space-y-3'>
          {messages.map((m) => {
            const isMe = m.user === username;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] p-3 rounded-lg shadow ${
                    isMe ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
                  }`}
                >
                  <div className='flex items-baseline justify-between gap-2'>
                    <div className='text-sm font-medium'>{isMe ? '我' : m.user}</div>
                    <div className='text-xs text-gray-300'>{dayjs(m.time).format('HH:mm:ss')}</div>
                  </div>
                  <div className='mt-1 text-sm whitespace-pre-wrap'>{m.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <form onSubmit={handleSubmit} className='p-3 border-t bg-white flex gap-2 items-center'>
        <input
          className='flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none'
          placeholder='在这里输入消息并回车发送...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type='submit' className='px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700'>
          发送
        </button>
      </form>
    </div>
  );
}
