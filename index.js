/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-11-23 13:45:44
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-11-23 13:45:55
 * @FilePath: /travel-dairy/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// 创建 FFmpeg 实例并启用日志记录
const ffmpeg = createFFmpeg({ log: true });

async function extractFrame() {
    const videoInput = document.getElementById('videoInput');
    const thumbnailImg = document.getElementById('thumbnailImg');
    const file = videoInput.files[0];

    if (!file) {
        alert('请选择一个视频文件！');
        return;
    }

    // 1. 加载 FFmpeg 核心模块
    if (!ffmpeg.isLoaded()) {
        console.log('正在加载 FFmpeg.wasm...');
        await ffmpeg.load();
        console.log('FFmpeg.wasm 加载完成。');
    }

    // 2. 将视频文件读取为 ArrayBuffer，并写入 FFmpeg 虚拟文件系统
    console.log('正在写入虚拟文件系统...');
    await ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

    // 3. 运行 FFmpeg 命令进行抽帧
    // 命令解释: 
    // -i input.mp4: 输入文件
    // -ss 00:00:05: 精确查找（seek）到视频的第 5 秒
    // -frames:v 1: 只输出 1 帧视频
    // thumb.jpg: 输出文件名
    console.log('正在执行 FFmpeg 命令...');
    await ffmpeg.exec([
        '-i', 'input.mp4',
        '-ss', '00:00:05',
        '-frames:v', '1',
        'thumb.jpg'
    ]);
    console.log('FFmpeg 命令执行完成。');

    // 4. 从虚拟文件系统中读取结果文件
    console.log('正在读取输出文件...');
    const data = ffmpeg.FS('readFile', 'thumb.jpg');
    
    // 5. 将 Uint8Array 数据转换为 Blob 并创建 URL
    const blob = new Blob([data.buffer], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);

    // 6. 在页面上显示图像
    thumbnailImg.src = url;
    console.log('抽帧成功，图像已显示。');

    // 清理虚拟文件系统（可选，但推荐）
    ffmpeg.FS('unlink', 'input.mp4');
    ffmpeg.FS('unlink', 'thumb.jpg');
}

// 使函数可以在 HTML 中调用
window.extractFrame = extractFrame;
