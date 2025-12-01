/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-11-30 09:37:31
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-12-01 11:05:23
 * @FilePath: /travel-dairy/src/app/utils/signaling.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Participant } from '@/hooks/useWebRtc';
import { io, Socket } from 'socket.io-client';

export type SignalingEvents = {
  onOffer: (data: { from: string; offer: RTCSessionDescriptionInit }) => void;
  onAnswer: (data: { from: string; answer: RTCSessionDescriptionInit }) => void;
  onIceCandidate: (data: { from: string; candidate: RTCIceCandidateInit }) => void;
  onAllUsers: (users: Participant[]) => void;
  onMembersStatus: (users: Partial<Participant>) => void;
  onUserJoined: (user: string) => void;
  onLeaveRoom: (user: string) => void;
};

export function createSignalingClient(roomId: string, events: SignalingEvents) {
  const socket: Socket = io('https://linable-jason-overconstantly.ngrok-free.dev', { transports: ['websocket', 'polling'] });

  socket.on('connect', () => {
    socket.emit('join-room', roomId);
  });

  socket.on('all-users', (users: Participant[]) => {
    events.onAllUsers(users);
  });

  socket.on('offer', events.onOffer);
  socket.on('answer', events.onAnswer);
  socket.on('ice-candidate', events.onIceCandidate);
  socket.on('user-joined', events.onUserJoined);
  socket.on('members-status', events.onMembersStatus);
  socket.on('leave-room', events.onLeaveRoom);

  function sendOffer(offer: RTCSessionDescriptionInit, to: string) {
    socket.emit('offer', { roomId, offer, to });
  }

  function sendAnswer(answer: RTCSessionDescriptionInit, to: string) {
    socket.emit('answer', { roomId, answer, to });
  }

  function sendIceCandidate(candidate: RTCIceCandidateInit, to: string) {
    socket.emit('ice-candidate', { candidate, to });
  }

  function sendMemberUpdate(p: Partial<Participant>) {
    socket.emit('member-update', p);
  }

  return { socket, sendOffer, sendAnswer, sendIceCandidate, sendMemberUpdate };
}
