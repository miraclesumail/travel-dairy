'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [nowTime, setTime] = useState<any>({});

  useEffect(() => {
    (async () => {
      const data = await fetch('https://worldtimeapi.org/api/timezone/Asia/Manila', { next: { revalidate: 8 } });
      const time = await data.json();
      setTime(time);
    })();
  }, []);

  return <div>{nowTime.datetime}</div>;
}
