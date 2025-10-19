'use client';

import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import dayjs from 'dayjs';
import LoginPage from './login';

type ChatMessage = {
  id: string;
  user: string;
  text: string;
  time: string; // ISO
  room: string;
};

type RoomInfo = {
  name: string;
  members: number;
  createdAt: string;
};

let socket: Socket | null = null;
function getSocket(server = 'http://localhost:4000') {
  if (!socket) {
    socket = io(server, { transports: ['websocket', 'polling'] });
  }
  return socket;
}

function connectSocket(token: string) {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io('http://localhost:4000', {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  console.log(socket, 'socketsocket');

  return socket;
}

export default function App() {
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [usersInRoom, setUsersInRoom] = useState<Record<string, any[]>>({});
  const [currentRoom, setCurrentRoom] = useState<string>('global');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || `User${Math.floor(Math.random() * 9000 + 1000)}`
  );

  const [token, setToken] = useState(localStorage.getItem('token'));

  const chatRef = useRef<HTMLDivElement | null>(null);

  const userList = usersInRoom[currentRoom] || [];

  useEffect(() => {
    if (!token) return;
    const s = connectSocket(token);
    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));

    s.on('room_list', (list: RoomInfo[]) => {
      console.log(list, 'ssssss');
      setRooms(list);
    });

    s.on('users_inRoom', (usersInRoom: any) => {
      console.log(usersInRoom, 'ssssss');
      setUsersInRoom(usersInRoom);
    });

    // server broadcasts messages for the room the socket is in
    s.on('message', (msg: ChatMessage) => {
      // only append if it's for current room (it should be since server emits to room)
      setMessages((prev) => [...prev, msg]);
    });

    // On connect, auto-join default room
    s.on('connect', () => {
      // join default room
      s.emit('join_room', 'global', (ok: boolean, history?: ChatMessage[]) => {
        if (ok && Array.isArray(history)) {
          setCurrentRoom('global');
          setMessages(history);
        }
      });
    });

    s.on('connect_error', (err) => {
      localStorage.removeItem('token');
      setToken('');
      console.error('socket connect_error', err.message);
    });

    return () => {
      s.off('connect');
      s.off('disconnect');
      s.off('room_list');
      s.off('users_inRoom');
      s.off('message');
      s.off('connect_error');
      // don't close socket here to allow hot-reload dev UX; close if desired
      // s.close();
    };
  }, [token]);

  // auto scroll
  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleCreateRoom = () => {
    const name = newRoomName.trim();
    if (!name) return alert('房间名不能为空');
    const s = getSocket();
    s.emit('create_room', name, (ok: boolean, message?: string) => {
      if (!ok) {
        alert(message || '创建失败');
        return;
      }
      setNewRoomName('');
      // optionally auto-join
      joinRoom(name);
    });
  };

  const joinRoom = (roomName: string) => {
    if (roomName !== currentRoom) {
      leaveRoom(currentRoom);
      const s = getSocket();
      s.emit('join_room', roomName, (ok: boolean, history?: ChatMessage[]) => {
        if (!ok) {
          alert('加入房间失败');
          return;
        }
        setCurrentRoom(roomName);
        setMessages(history || []);
      });
    } else {
      return;
    }
  };

  const leaveRoom = (roomName: string) => {
    const s = getSocket();
    s.emit('leave_room', roomName, (ok: boolean) => {
      if (!ok) {
        alert('离开失败');
        return;
      }
      // after leaving, auto-join global
      // if (roomName === currentRoom) {
      //   joinRoom('global');
      // }
    });
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const s = getSocket();
    s.emit('message', { user: username, text, room: currentRoom });
    setInput('');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const saveName = () => {
    localStorage.setItem('chat_username', username);
  };

  return token ? (
    <div className='h-screen flex bg-gray-100'>
      {/* Left: room list */}
      <aside className='w-72 bg-white border-r p-4 flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>房间</h2>
          <div
            className={`text-xs px-2 py-0.5 rounded ${
              connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {connected ? '在线' : '离线'}
          </div>
        </div>

        <div className='flex gap-2'>
          <input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder='新房间名'
            className='flex-1 px-2 py-1 border rounded text-sm'
          />
          <button onClick={handleCreateRoom} className='px-3 py-1 bg-blue-600 text-white rounded text-sm'>
            创建
          </button>
        </div>

        <div className='flex-1 overflow-auto'>
          {rooms.map((r) => (
            <div
              key={r.name}
              className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                r.name === currentRoom ? 'bg-gray-50' : ''
              }`}
            >
              <div onClick={() => joinRoom(r.name)} className='flex-1'>
                <div className='text-sm font-medium'>
                  {r.name}--{formatDate(r.createdAt)}
                </div>
                <div className='text-xs text-gray-400'>{r.members} 人</div>
              </div>
              {/* {r.name !== 'global' && (
                <div className='flex flex-col gap-1'>
                  <button onClick={() => joinRoom(r.name)} className='text-xs px-2 py-1 border rounded'>
                    进
                  </button>
                  <button onClick={() => leaveRoom(r.name)} className='text-xs px-2 py-1 border rounded'>
                    退
                  </button>
                </div>
              )} */}
            </div>
          ))}
        </div>

        <div className='text-xs text-gray-500'>
          用户名：
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={saveName}
            className='ml-2 px-2 py-1 border rounded text-sm'
          />
        </div>
      </aside>

      {/* Right: chat */}
      <div className='flex-1 flex flex-col'>
        <header className='p-4 border-b bg-white flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-semibold'>
              房间：{currentRoom}
              {userList.length ? (
                <>
                  <span className='text-blue-500 ml-3'>当前在线:</span>
                  {userList.map((user) => (
                    <span key={user} className='ml-1'>
                      {user}
                    </span>
                  ))}
                </>
              ) : null}
            </h1>
            <div className='text-sm text-gray-500'>只显示并发送到当前房间的消息</div>
          </div>
          <div className='text-sm text-gray-400'>{messages.length} 条消息</div>
        </header>

        <div ref={chatRef} className='flex-1 overflow-auto p-4 space-y-3 bg-[linear-gradient(180deg,#f8fafc,#fff)]'>
          {messages.map((m) => {
            const isMe = m.user === username;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow ${
                    isMe ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
                  }`}
                >
                  <div className='flex justify-between items-baseline gap-2'>
                    <div className='text-sm font-medium'>{isMe ? '我' : m.user}</div>
                    <div className='text-xs text-gray-300'>{dayjs(m.time).format('HH:mm:ss')}</div>
                  </div>
                  <div className='mt-1 text-sm whitespace-pre-wrap'>{m.text}</div>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSend} className='p-3 border-t bg-white flex items-center gap-2'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`向 ${currentRoom} 发送消息...`}
            className='flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none'
          />
          <button type='submit' className='px-4 py-2 rounded-full bg-blue-600 text-white'>
            发送
          </button>
        </form>
      </div>
    </div>
  ) : (
    <LoginPage setToken={setToken} setUsername={setUsername} />
  );
}

function formatDate(isoDateString: string) {
  // The original ISO 8601 string from the previous example

  // 1. Create a new Date object from the string
  const date = new Date(isoDateString);

  // 2. Define a helper function to add leading zeros for single-digit numbers
  const pad = (num: any) => String(num).padStart(2, '0');

  // 3. Extract the date components and apply formatting
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const month = pad(date.getMonth() + 1); // getMonth() returns 0-11, so add 1
  const day = pad(date.getDate());
  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year

  // 4. Combine the formatted components into the desired string
  const formattedDate = `${hours}/${minutes} ${month}-${day}-${year}`;
  return formattedDate;
}
