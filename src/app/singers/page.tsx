/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-07 22:48:06
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-01-12 16:57:15
 * @FilePath: /nextjs/travel-dairy/src/app/singers/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import excel, { Workbook } from 'exceljs';
import { SHA256, lib } from 'crypto-js';

const Page = () => {
  const [list, setList] = useState<any[]>([]);

  const workbook = new excel.Workbook();

  workbook.creator = 'hello me';
  workbook.created = new Date();

  // workbook.views = [
  //   {
  //     x: 0,
  //     y: 0,
  //     width: 1800,
  //     height: 1000,
  //     firstSheet: 2,
  //     activeTab: 1,
  //     visibility: 'hidden',
  //   },
  // ];

  const ws = workbook.addWorksheet('ws-test1');

  ws.addTable({
    name: 'MyTable',
    ref: 'A1',
    headerRow: true,
    style: {},
    // style: {
    //   theme: 'TableStyleDark3',
    //   showRowStripes: true,
    // },

    columns: [
      { name: 'Date' },
      { name: 'Amount' },
      { name: 'Amount' },
      { name: 'Amount' },
      { name: 'Amount' },
      { name: 'Amount' },
    ],
    rows: [
      [new Date('2019-07-20'), 70.1, 88, 88, 99, 99],
      [new Date('2019-07-21'), 70.6, 88, 88, 99, 99],
      [new Date('2019-07-22'), 70.1, 88, 88, 99, 99],
    ],
  });

  ws.eachRow((row) => {
    console.log(row, 'rrr');
    row.height = 40;
    row.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
  });

  ws.getRow(1).eachCell((cell) => {
    console.log(cell, 'cell');
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F5D300' },
    };
  });

  const generateFile = (workbook: Workbook) => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `this is test excel`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await (await fetch('/api/getSingers')).json();
        console.log(data.list);
        setList(data.list);
      } catch (error) {
        console.log(error);
        throw error;
      }
    })();
  }, []);

  return (
    <div>
      singers
      <input type='file' id='files' name='file' />
      <button onClick={() => readBlob()}>entire file</button>
      <div id='crypto_sha256'></div>
      {list.length > 0 ? list[0].name : ''}
      <div onClick={() => generateFile(workbook)}>generate</div>
    </div>
  );
};

function readBlob(opt_startByte, opt_stopByte) {
  var files = document.getElementById('files').files;
  if (!files.length) {
    alert('Please select a file!');
    return;
  }

  var file = files[0];
  var start = parseInt(opt_startByte) || 0;
  var stop = parseInt(opt_stopByte) || file.size - 1;

  var reader = new FileReader();

  // If we use onloadend, we need to check the readyState.
  reader.onloadend = function (evt) {
    if (evt.target.readyState == FileReader.DONE) {
      var hash = SHA256(lib.WordArray.create(evt.target.result)).toString();

      document.getElementById('crypto_sha256').textContent = ['SHA-256: ', hash].join('');
    }
  };

  var blob = file.slice(start, stop + 1);
  reader.readAsArrayBuffer(blob);
}

export default Page;
