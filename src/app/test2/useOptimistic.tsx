/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-10-06 18:33:58
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-10-06 18:57:06
 * @FilePath: /travel-dairy/src/app/test2/useOptimistic.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useOptimistic, useRef, useState } from 'react';

const Page = () => {
  const [messages, setMessages] = useState([{ text: 'Hello there!', sending: false, key: 1 }]);

  async function sendMessage(formData: FormData) {
    const sentMessage = await deliverMessage(formData.get('message'));
    setMessages((messages: any[]) => [...messages, { text: sentMessage }]);
  }
  return (
    <div>
      useOptimistic
      <div>
        <Thread messages={messages} sendMessage={sendMessage} />
      </div>
    </div>
  );
};

function Thread({ messages, sendMessage }: any) {
  const formRef: any = useRef<HTMLFormElement>();

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(messages, (state: any, newMsg: any) => {
    console.log('execute add useOptimistic', newMsg);

    return [...state, { text: newMsg, sending: true }];
  });

  console.log(optimisticMessages, 'optimisticMessagesoptimisticMessages')

  async function formAction(formData: FormData) {
    addOptimisticMessage(formData.get('message'));
    formRef.current.reset();
    await sendMessage(formData);
  }

  return (
    <>
      {optimisticMessages.map((message: any, index: number) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type='text' name='message' placeholder='Hello!' />
        <button type='submit'>Send</button>
      </form>
    </>
  );
}

async function deliverMessage(message: any) {
  await new Promise((res) => setTimeout(res, 3000));
  return message;
}

export default Page;
