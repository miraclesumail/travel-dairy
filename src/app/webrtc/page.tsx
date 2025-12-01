'use client';

import { useWebRTC } from '@/hooks/useWebRtc';
import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const [roomId, setRoomId] = useState('test-room');
  const [joined, setJoined] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      {!joined ? (
        <div>
          <h2>多人 WebRTC Demo（P2P Mesh）</h2>
          <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder='输入房间号' />
          <button onClick={() => setJoined(true)}>加入房间</button>
          <p>打开多个浏览器 / 设备，输入同一个房间号，就能看到多路视频。</p>
        </div>
      ) : (
        <VideoChat roomId={roomId} />
      )}
    </div>
  );
}

interface VideoChatProps {
  roomId: string;
}

export const VideoChat: React.FC<VideoChatProps> = ({ roomId }) => {
  const {
    localStream,
    remoteStreams,
    toggleAudio,
    toggleVideo,
    audioEnabled,
    videoEnabled,
    participants,
    socket,
    pcMap,
  } = useWebRTC({
    roomId,
  });
  const [showParticipants, setShowParticipants] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const originVideoTrackRef = useRef<MediaStreamTrack | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    // 为每个远端流绑定 video 元素
    remoteStreams.forEach(({ userId, stream }) => {
      const videoEl = remoteVideoRefs.current.get(userId);
      if (videoEl && stream && videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }
    });
  }, [remoteStreams]);

  // 模拟屏幕共享
  const startScreenShare = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { max: 1920 },
        height: { max: 1080 },
        frameRate: {
          max: 30,
        },
      },
      audio: false,
    });

    const screenTrack = screenStream.getVideoTracks()[0];
    screenStreamRef.current = screenStream;

    originVideoTrackRef.current = localStream?.getVideoTracks()[0] || null;
    localVideoRef.current!.srcObject = screenStream;

    pcMap.forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === 'video');

      if (sender) sender.replaceTrack(screenTrack);
    });

    screenTrack.onended = stopScreenShare;
    setIsScreenSharing(true);
  };

  const stopScreenShare = () => {
    const screenStream = screenStreamRef.current;
    const originalTrack = originVideoTrackRef.current;

    if (!screenStream || !originalTrack) return;

    // 停止屏幕共享的 track
    screenStream.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;

    // 恢复本地摄像头画面
    localVideoRef.current!.srcObject = localStream;

    // 替换回摄像头轨道
    pcMap.forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
      if (sender) sender.replaceTrack(originalTrack);
    });

    setIsScreenSharing(false);
  };

  return (
    <div style={{ padding: 16 }}>
      {/* 顶部标题栏 */}
      <header
        style={{
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#202124',
          borderBottom: '1px solid #333',
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Zoom-like Meeting</div>
          <div style={{ fontSize: 12, color: '#aaa' }}>房间号：{roomId}</div>
        </div>
        <div style={{ fontSize: 12, color: '#aaa' }}>参会人数：{participants.length}</div>
      </header>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* 本地视频容器 */}
        <div
          style={{
            position: 'relative',
            width: 260,
          }}
        >
          <h3>本地视频</h3>
          <div
            style={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
            }}
            className='local-video-container group'
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted // 本地预览保持静音，避免回声
              style={{
                width: '100%',
                background: '#000',
                display: 'block',
              }}
            />

            {/* 悬浮时显示的控制条 */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                padding: '6px 8px',
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                opacity: 0,
                transition: 'opacity 0.2s',
                // 用 pointerEvents 来避免挡住 video 点击（如果你未来有点击事件）
                pointerEvents: 'none',
              }}
              className='local-video-controls group-hover:!opacity-100'
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAudio();
                }}
                style={{
                  pointerEvents: 'auto',
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: 'none',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {audioEnabled ? '静音 🔊' : '取消静音 🔇'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVideo();
                }}
                style={{
                  pointerEvents: 'auto',
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: 'none',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {videoEnabled ? '关摄像头 🎥' : '开摄像头 🚫'}
              </button>
            </div>
            <div className='video-toolbar opacity-0 hover:opacity-100 transition absolute bottom-2 right-2 flex gap-2 bg-black/40 px-3 py-1 rounded'>
              <button
                className='text-white'
                onClick={() => {
                  if (!isScreenSharing) startScreenShare();
                  else stopScreenShare();
                }}
              >
                {isScreenSharing ? '停止共享' : '共享屏幕'}
              </button>
            </div>
          </div>

          {/* 状态文字（可选） */}
          <div style={{ marginTop: 4, fontSize: 12 }}>
            麦克风：{audioEnabled ? '开' : '关'}，摄像头：{videoEnabled ? '开' : '关'}
          </div>
        </div>

        {/* 远端视频区域 */}
        <div style={{ flex: 1 }}>
          <h3>远端视频（多人）</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 12,
            }}
          >
            {remoteStreams.map(({ userId }) => (
              <div key={userId}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>用户：{userId}</div>
                <video
                  ref={(el) => {
                    if (!el) {
                      remoteVideoRefs.current.delete(userId);
                    } else {
                      remoteVideoRefs.current.set(userId, el);
                    }
                  }}
                  autoPlay
                  playsInline
                  style={{ width: '100%', background: '#000' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧成员列表抽屉 */}
      {showParticipants && (
        <aside
          style={{
            width: 260,
            borderLeft: '1px solid #333',

            background: '#202124',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid #333',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>成员列表</div>
            <button
              onClick={() => setShowParticipants(false)}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#aaa',
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              关闭
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 0',
            }}
          >
            {participants.map((p) => (
              <div
                key={p.userId}
                style={{
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  background: p.userId == socket!.id ? 'rgba(26,115,232,0.2)' : 'transparent',
                }}
              >
                <div>
                  {p.userId == socket!.id ? (
                    <>
                      <span>我（本机）</span>
                      <span style={{ marginLeft: 6, fontSize: 11, color: '#aaa' }}>{p.userId.slice(0, 6)}...</span>
                    </>
                  ) : (
                    `用户：${p.userId.slice(0, 6)}...`
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  {/* 麦克风图标 */}
                  <span>{p.audioEnabled ? '🎤' : '🔇'}</span>
                  {/* 摄像头图标 */}
                  <span>{p.videoEnabled ? '📷' : '🚫'}</span>
                  <span>{p.isSpeaking ? '讲话中' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
};
