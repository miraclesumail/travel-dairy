import React, { useState, useRef, useEffect } from 'react';

interface Track {
  title: string;
  artist: string;
  src: string;
  cover: string;
}

interface MusicPlayerProps {
  playlist: Track[];
}

// 格式化播放时间（单位：秒 → mm:ss）
export function formatTime(sec: number) {
  if (!isFinite(sec) || sec <= 0) return '00:00';
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

const MusicPlayerPro: React.FC<MusicPlayerProps> = ({ playlist }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shuffledOrder, setShuffledOrder] = useState<number[] | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = playlist[currentTrack];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (shuffle && shuffledOrder) {
      const pos = shuffledOrder?.indexOf(currentTrack);
      setCurrentTrack(shuffledOrder[(pos + 1) % shuffledOrder?.length]);
    } else {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
    setIsPlaying(true);
    setProgress(0);
  };

  const handlePrev = () => {
    if (shuffle && shuffledOrder) {
      const pos = shuffledOrder?.indexOf(currentTrack);
      setCurrentTrack(shuffledOrder[(pos - 1 + shuffledOrder.length) % shuffledOrder?.length]);
    } else {
      setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
    setIsPlaying(true);
    setProgress(0);
  };

  const toggleShuffle = () => {
    setShuffle((s) => {
      const ns = !s;
      if (ns) {
        // generate new shuffled order with current index as starting point
        const order = playlist.map((_, i) => i);
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [order[i], order[j]] = [order[j], order[i]];
        }
        // if current isn't first, rotate so current is at current position
        setShuffledOrder(order);
      } else {
        setShuffledOrder(null);
      }
      return ns;
    });
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audio.duration;
    audio.currentTime = newTime;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.play();
    }
  }, [currentTrack]);

  return (
    <div className='w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-2xl p-6 flex flex-col items-center'>
      {/* 封面 */}
      <div
        className={`w-48 h-48 rounded-full mb-5 shadow-lg overflow-hidden transition-transform duration-7000 ${
          isPlaying ? 'animate-spin-slow' : ''
        }`}
      >
        <img src={track.cover} alt={track.title} className='w-full h-full object-cover' />
      </div>

      {/* 标题与歌手 */}
      <div className='text-center mb-4'>
        <h2 className='text-xl font-bold'>{track.title}</h2>
        <p className='text-gray-400 text-sm'>{track.artist}</p>
      </div>

      {/* 进度条 */}
      <div className='w-full h-2 bg-gray-700 rounded-full cursor-pointer mb-4 relative' onClick={handleProgressClick}>
        <div
          className='h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full transition-all duration-300'
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* 控制按钮 */}
      <div className='flex items-center justify-center gap-6'>
        <button onClick={toggleShuffle} className={`px-2 py-1 rounded ${shuffle ? 'bg-pink-600' : 'bg-gray-700'}`}>
          🔀
        </button>
        <button onClick={handlePrev} className='p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition'>
          ⏮️
        </button>
        <button
          onClick={togglePlay}
          className='w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform'
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button onClick={handleNext} className='p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition'>
          ⏭️
        </button>

        <div>
          {formatTime(Number(audioRef.current?.currentTime))} / {formatTime(Number(audioRef.current?.duration))}
        </div>
      </div>

      {/* 播放列表 */}
      <div className='mt-6 w-full border-t border-gray-700 pt-3'>
        <h3 className='text-sm text-gray-400 mb-2'>播放列表</h3>
        <ul className='space-y-1 max-h-40 overflow-y-auto'>
          {playlist.map((t, i) => (
            <li
              key={i}
              onClick={() => setCurrentTrack(i)}
              className={`p-2 rounded-md cursor-pointer transition ${
                i === currentTrack ? 'bg-gradient-to-r from-pink-600 to-purple-600' : 'hover:bg-gray-800'
              }`}
            >
              <p className='text-sm font-medium'>{t.title}</p>
              <p className='text-xs text-gray-400'>{t.artist}</p>
            </li>
          ))}
        </ul>
      </div>

      <audio ref={audioRef} src={track.src} preload='metadata' />
    </div>
  );
};

export default MusicPlayerPro;
