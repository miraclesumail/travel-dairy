'use client';

interface TimelineItem {
  id: number;
  title: string;
  date?: string;
  description?: string;
}

const items: TimelineItem[] = [
  {
    id: 1,
    title: '项目立项',
    date: '2025-01-10',
    description: '项目正式启动，组建核心团队。',
  },
  {
    id: 2,
    title: '设计阶段',
    date: '2025-02-04',
    description: '完成产品原型与 UI 设计稿。',
  },
  {
    id: 3,
    title: '开发阶段',
    date: '2025-03-20',
    description: '实现主要功能模块并联调测试。',
  },
  {
    id: 4,
    title: '正式上线',
    date: '2025-05-01',
    description: '部署到生产环境，全量发布。',
  },
];

const App: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-10 px-6'>
      <h1 className='text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-10'>
        🌈 炫酷时间轴 Timeline
      </h1>

      <div className='relative max-w-2xl mx-auto'>
        {/* 渐变竖线 */}
        <div className='absolute left-5 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-pink-400 rounded-full'></div>

        {/* 时间轴内容 */}
        <ul className='space-y-10'>
          {items.map((item, i) => (
            <li
              key={item.id}
              className={`relative pl-14 transition-all duration-700 ease-out animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {/* 圆点 */}
              <span className='absolute left-1.5 top-1.5 w-7 h-7 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full shadow-md ring-4 ring-white dark:ring-gray-900 flex items-center justify-center text-white font-bold'>
                {i + 1}
              </span>

              {/* 内容卡片 */}
              <div className='bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:-translate-y-1 hover:shadow-xl transition-transform duration-300'>
                <div className='flex items-baseline justify-between mb-1'>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>{item.title}</h3>
                  {item.date && <time className='text-sm text-gray-500 dark:text-gray-400'>{item.date}</time>}
                </div>
                <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
