/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-11-30 09:41:02
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-12-01 19:40:06
 * @FilePath: /travel-dairy/src/hooks/useWebRtc.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE/u
 */
import { createSignalingClient } from '@/app/utils/signaling';
import { useEffect, useRef, useState } from 'react';

export interface RemoteStreamInfo {
  userId: string;
  stream: MediaStream;
}

export interface Participant {
  userId: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isSpeaking: boolean;
}

const audioContexts = {} as Record<
  string,
  {
    ctx: AudioContext;
    analyser: AnalyserNode;
    source: MediaStreamAudioSourceNode;
  }
>;

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function');
}

export function useWebRTC({ roomId }: { roomId: string }) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStreamInfo[]>([]);

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const [participants, setParticipants] = useState<Participant[]>([]);

  const pcRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const signalingRef = useRef<ReturnType<typeof createSignalingClient> | null>(null);

  useEffect(() => {
    if (!hasGetUserMedia()) {
      alert('当前浏览器不支持摄像头/麦克风访问，请在 iOS 上使用最新版 Safari 打开，并确保系统已更新。');
      // 或者显示一个友好的 UI 提示
    } else {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        setLocalStream(stream);
        startVoiceActivityDetection(signalingRef.current?.socket.id!, stream);
      });
    }
  }, []);

  const createPeerConnection = (remoteUserId: string): RTCPeerConnection => {
    let pc = pcRef.current.get(remoteUserId);
    if (pc) return pc;

    pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    localStream?.getTracks().forEach((track) => pc!.addTrack(track, localStream));

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      const track = event.track;

      const isScreenShare = ['screen', 'window', 'display'].includes(track.label.toLocaleLowerCase());

      console.log(track.label.toLocaleLowerCase());
      console.log(`peer ${remoteUserId} ${isScreenShare ? 'sharing' : ''}`);

      setRemoteStreams((prev) => {
        const exist = prev.find((item) => item.userId === remoteUserId);

        if (exist) {
          return prev.map((item) => (item.userId === remoteUserId ? { ...item, stream } : item));
        }

        return [...prev, { userId: remoteUserId, stream }];
      });

      startVoiceActivityDetection(remoteUserId, stream);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && signalingRef.current) {
        signalingRef.current.sendIceCandidate(event.candidate.toJSON(), remoteUserId);
      }
    };

    pcRef.current.set(remoteUserId, pc);
    return pc;
  };

  const startVoiceActivityDetection = (userId: string, stream: MediaStream) => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;

    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);

    audioContexts[userId] = { ctx, analyser, source };

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const threshold = 35; // 音量阈值，越小越灵敏
    let speaking = false;

    const detect = () => {
      analyser.getByteFrequencyData(dataArray);

      // 计算平均音量
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const avg = sum / dataArray.length;

      const isNowSpeaking = avg > threshold;

      if (isNowSpeaking !== speaking) {
        speaking = isNowSpeaking;

        setParticipants((prev) => prev.map((p) => (p.userId === userId ? { ...p, isSpeaking: speaking } : p)));
      }

      requestAnimationFrame(detect);
    };

    detect();
  };

  useEffect(() => {
    if (!localStream) return;

    signalingRef.current = createSignalingClient(roomId, {
      // 加入房间后返回当前已在房间的成员
      onAllUsers: async (users: Participant[]) => {
        setParticipants([
          { userId: signalingRef.current?.socket.id!, audioEnabled: true, videoEnabled: true, isSpeaking: false },
          ...users,
        ]);
        for (const user of users) {
          const pc = createPeerConnection(user.userId);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          signalingRef.current?.sendOffer(offer, user.userId);
        }
      },

      // 有用户加入
      onUserJoined: (userId) => {
        setParticipants((pp) =>
          pp.find((p) => p.userId !== userId)
            ? [
                ...pp,
                {
                  userId,
                  audioEnabled: true,
                  videoEnabled: true,
                  isSpeaking: false,
                },
              ]
            : [...pp]
        );
      },

      onLeaveRoom: (userId) => {
        setParticipants((pp) => pp.filter((p) => p.userId !== userId));
        setRemoteStreams((rr) => rr.filter((r) => r.userId !== userId));
      },

      onMembersStatus: (p) => {
        setParticipants((pp) => pp.map((_p) => (_p.userId === p.userId! ? { ..._p, ...p } : _p)));
      },

      onOffer: async ({ from, offer }: any) => {
        const pc = createPeerConnection(from);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        signalingRef.current?.sendAnswer(answer, from);
      },

      onAnswer: async ({ from, answer }: any) => {
        const pc = pcRef.current.get(from);
        if (!pc) return;

        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      },

      onIceCandidate: async ({ from, candidate }: any) => {
        const pc = pcRef.current.get(from);
        if (!pc || !candidate) return;
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {}
      },
    });

    return () => {
      signalingRef.current?.socket.disconnect();
      pcRef.current.forEach((pc) => pc.close());
      pcRef.current.clear();
      setRemoteStreams([]);
      localStream?.getTracks().forEach((t) => t.stop());
    };
  }, [roomId, localStream]);

  const toggleAudio = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((track) => (track.enabled = !audioEnabled));
    setAudioEnabled(!audioEnabled);
    signalingRef.current?.sendMemberUpdate({
      userId: signalingRef.current?.socket.id,
      audioEnabled: !audioEnabled,
    });
  };

  const toggleVideo = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((track) => (track.enabled = !videoEnabled));
    setVideoEnabled(!videoEnabled);
    signalingRef.current?.sendMemberUpdate({
      userId: signalingRef.current?.socket.id,
      videoEnabled: !videoEnabled,
    });
  };

  return {
    localStream,
    remoteStreams,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
    participants,
    pcMap: pcRef.current,
    socket: signalingRef.current?.socket,
  };
}
