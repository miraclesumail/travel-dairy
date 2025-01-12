/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-12-13 22:09:41
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2024-12-18 20:06:39
 * @FilePath: /travel-dairy/src/app/api/send/route.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Resend } from 'resend';

const resend = new Resend('re_W1hC4aA2_Aw4tbnE8BWvGfgDYmD2pgATz');

export async function POST() {
try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['sumail@xyzzdev.com'],
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>cncncn</strong>!</p>',
    });

    //     resend.domains.create({ name: 'sumail@xyzzdev.com' });


    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
