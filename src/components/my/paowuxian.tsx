import { useEffect } from 'react';

export default function Paowuxian() {
  useEffect(() => {
    const canvas = document.getElementById('parabolaCanvas')! as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;

    const startX = 0;
    const startY = 300;
    const endX = 600;
    const endY = 300;
    const peakHeight = 150; // 最高点Y坐标 (注意: Canvas Y轴向下为正)
    const duration = 2000; // 动画持续时间 (毫秒)

    const startTime = Date.now();

    // 抛物线方程参数计算 (简化版，确保起点和终点高度一致)
    // 我们需要找到一个系数 a，使得轨迹从起点到终点形成抛物线
    // 顶点 x 坐标在中间: h = (startX + endX) / 2
    const h = (startX + endX) / 2; // h = 300
    // 顶点 y 坐标就是我们想要的最高点: k = peakHeight
    const k = peakHeight; // k = 150

    // 代入起点 (startX, startY) 或终点 (endX, endY) 来解出 a
    // startY = a * (startX - h)^2 + k
    // 300 = a * (0 - 300)^2 + 150
    // 150 = a * 90000
    // a = 150 / 90000 ≈ 0.001667 (注意：这个a值是数学坐标系下的，Canvas需要调整)

    // 在 Canvas 坐标系中，y 越大越靠下。为了让抛物线“向上凸起”，
    // 实际渲染时，我们需要将数学坐标系的Y轴反转（或者调整a值的正负）。
    // 这里使用数学坐标系计算 a = 0.001667
    const a = (startY - k) / Math.pow(startX - h, 2);

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1); // 动画进度 0到1

      // 使用线性插值计算当前 x 坐标 (沿水平方向匀速移动)
      const currentX = startX + (endX - startX) * progress;

      // 使用抛物线函数计算当前 y 坐标
      // y = a(x - h)^2 + k
      // 由于Canvas Y轴向下为正，我们直接使用计算出的 a 值
      // 如果想要更直观的“抛物线”效果（起点终点高，中间低），可以调整 peakHeight
      const currentY = a * Math.pow(currentX - h, 2) + k;

      // 绘制小球
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(currentX, currentY, 10, 0, Math.PI * 2); // 绘制半径为10的圆
      ctx.fillStyle = 'blue';
      ctx.fill();
      ctx.closePath();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    // 启动动画
    animate();
  }, []);

  return (
    <canvas
      id='parabolaCanvas'
      width='600'
      height='400'
      style={{ border: '1px solid #000' }}
      className='mx-auto'
    ></canvas>
  );
}
