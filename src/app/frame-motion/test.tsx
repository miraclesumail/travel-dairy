import { useEffect, useLayoutEffect, useRef, useState } from 'react';
const delay = (time: number) => new Promise((resolve) => setTimeout(() => resolve(1), time * 1000));

const Test = () => {
  const [show, setShow] = useState(false);
  const ref = useRef<any>();

  useLayoutEffect(() => {
    if (!ref.current) return;
    if (show) {
      setTimeout(() => {
        (ref.current as HTMLElement).style.left = '200px';
      }, 2000);

      //   (async () => {
      //     // await delay(5);
      //   })();
    }
  }, [show]);

  return (
    <div>
      <span onClick={() => setShow(true)}>test</span>
      {show ? (
        <div ref={ref as any} style={{ position: 'absolute' }}>
          axiab
        </div>
      ) : null}
    </div>
  );
};

export default Test;
