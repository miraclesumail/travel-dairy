import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import addTodo from '@/app/actions/addTodo';

export default async function Page() {
  const headerList = headers();
  const host = headerList.get('host');
  console.log(headerList.get('host'));
  console.log(headerList.keys());
  const data = await fetch(`http:/${host}/api/getTime`, { cache: 'no-cache' });
  const time = await data.json();

  // setTimeout(() => {
  //   console.log('chache---');
  //   revalidatePath('/cache')

  // }, 8000);

  return (
    <div>
      NOW TIME is {time.time}
      <div>click</div>
      <form action={addTodo} method='POST'>
        <div>
          <label htmlFor='todo'>Todo</label>
          <div>
            <input id='todo' name='todo' type='text' placeholder='What needs to be done?' required />
          </div>
        </div>
        <div>
          <button type='submit'> Add Todo</button>
        </div>
      </form>
    </div>
  );
}
