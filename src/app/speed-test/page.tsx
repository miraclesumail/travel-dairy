'use client';
import React, { useState } from 'react';

interface SpeedResult {
  speedMbps: number;
  speedMBps: number;
  durationSec: number;
  sizeMB: number;
}

const SpeedTest: React.FC = () => {
  const [downProgress, setDownProgress] = useState(0);
  const [upProgress, setUpProgress] = useState(0);
  const [downStatus, setDownStatus] = useState('等待开始...');
  const [upStatus, setUpStatus] = useState('等待开始...');
  const [testing, setTesting] = useState(false);

  // 下载测速
  const testDownload = async (url: string, sizeBytes: number): Promise<SpeedResult> => {
    setDownProgress(0);
    setDownStatus('下载测速中...');
    const startTime = performance.now();

    const response = await fetch(url + '?cache=' + Math.random());
    const reader = response.body?.getReader();
    if (!reader) throw new Error('读取失败');

    let bytesReceived = 0;
    const total = sizeBytes;
    let lastUpdate = performance.now();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesReceived += value.length;

      const now = performance.now();
      if (now - lastUpdate > 500) {
        const elapsedSec = (now - startTime) / 1000;
        const bitsLoaded = bytesReceived * 8;
        const speedMbps = bitsLoaded / elapsedSec / 1_000_000;
        setDownProgress(Math.min((bytesReceived / total) * 100, 100));
        setDownStatus(`实时速度: ${speedMbps.toFixed(2)} Mbps`);
        lastUpdate = now;
      }
    }

    const endTime = performance.now();

    console.log(endTime - startTime, 'endTime - startTime')
    const durationSec = (endTime - startTime) / 1000;
    const bitsLoaded = bytesReceived * 8;
    const speedMbps = bitsLoaded / durationSec / 1_000_000;
    const speedMBps = bytesReceived / durationSec / 1024 / 1024;
    const sizeMB = bytesReceived / 1024 / 1024;

    setDownProgress(100);
    setDownStatus(`
      平均下载速度: ${speedMbps.toFixed(2)} Mbps (${speedMBps.toFixed(2)} MB/s)`);

    return { speedMbps, speedMBps, durationSec, sizeMB };
  };

  // 上传测速
  const testUpload = async (uploadUrl: string, dataSizeBytes = 2_000_000): Promise<SpeedResult> => {
    setUpProgress(0);
    setUpStatus('上传测速中...');

    const randomData = new Blob([new ArrayBuffer(dataSizeBytes)]);
    const startTime = performance.now();

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl + '?cache=' + Math.random(), true);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUpProgress(progress);
          const elapsedSec = (performance.now() - startTime) / 1000;
          const bitsUploaded = e.loaded * 8;
          const speedMbps = bitsUploaded / elapsedSec / 1_000_000;
          setUpStatus(`实时速度: ${speedMbps.toFixed(2)} Mbps`);
        }
      };
      xhr.onload = () => resolve();
      xhr.onerror = () => reject(new Error('上传失败'));
      xhr.send(randomData);
    });

    const endTime = performance.now();
    const durationSec = (endTime - startTime) / 1000;
    const bitsUploaded = dataSizeBytes * 8;
    const speedMbps = bitsUploaded / durationSec / 1_000_000;
    const speedMBps = dataSizeBytes / durationSec / 1024 / 1024;
    const sizeMB = dataSizeBytes / 1024 / 1024;

    setUpProgress(100);
    setUpStatus(`平均上传速度: ${speedMbps.toFixed(2)} Mbps (${speedMBps.toFixed(2)} MB/s)`);

    return { speedMbps, speedMBps, durationSec, sizeMB };
  };

  // 主流程
  const startTest = async () => {
    if (testing) return;
    setTesting(true);
    try {
      await testDownload('http://127.0.0.1:5500/packages/wind/100MB.bin', 10_000_000);
      await testUpload('https://httpbin.org/post', 2_000_000);
    } catch (e) {
      console.error(e);
    }
    setTesting(false);
  };

  return (
    <div className='flex flex-col items-center bg-white shadow-lg rounded-xl p-6 w-96'>
      <h2 className='text-2xl font-semibold mb-4'>网络速度测试</h2>

      {/* 下载测速 */}
      <div className='w-full mb-4'>
        <h3 className='text-lg font-medium mb-1'>下载测速</h3>
        <progress value={downProgress} max={100} className='w-full h-4 rounded bg-gray-200' />
        <p className='text-gray-700 mt-2'>{downStatus}</p>
      </div>

      {/* 上传测速 */}
      <div className='w-full mb-4'>
        <h3 className='text-lg font-medium mb-1'>上传测速</h3>
        <progress value={upProgress} max={100} className='w-full h-4 rounded bg-gray-200' />
        <p className='text-gray-700 mt-2'>{upStatus}</p>
      </div>

      <button
        onClick={startTest}
        disabled={testing}
        className={`mt-3 px-6 py-2 rounded text-white ${testing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {testing ? '测速中...' : '开始测速'}
      </button>
    </div>
  );
};

export default SpeedTest;
