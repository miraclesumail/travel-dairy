/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2024-07-07 22:48:06
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-03-11 17:22:00
 * @FilePath: /nextjs/travel-dairy/src/app/singers/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// @ts-nocheck
'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import excel from 'exceljs';
import { groupBy, compact, isEmpty } from 'lodash';

const fileToBuffer = (file: File): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer instanceof ArrayBuffer) {
        resolve(Buffer.from(arrayBuffer));
      } else {
        reject(new Error('Could not convert file to buffer'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });

function sheetToJson({ sheet, headerRowNumber = 1 }) {
  let headerRow = sheet?.getRow(headerRowNumber);
  headerRow = headerRow._cells.map((cell) => {
    let header = cell.value;
    return {
      column: cell._column._number,
      address: cell.address,
      value: header,
    };
  });

  let headers = {};
  headerRow.forEach((row) => {
    headers[row.column] = row.value;
  });

  let rows = sheet._rows.map((row) => {
    return row._cells.map((cell) => {
      return {
        column: cell._column._number,
        cell: cell.address,
        value: cell.value,
      };
    });
  });
  rows = rows.slice(headerRowNumber).map((row) => {
    let data = [];
    if (isEmpty(compact(row.map((cell) => cell.value)))) return null;

    row.forEach((cell) => {
      let key = headers[cell.column];
      let value = cell.value;
      data.push({ key, value });
    });
    console.log(data)
    data = groupBy(data, 'key');
    console.log(data, '11')

    for (let key of Object.keys(data)) {
      data[key] = data[key].map((k) => k.value);
    }
    return data;
  });
  rows = compact(rows);
  // console.log(JSON.stringify(rows, null, 2));
  return rows;
}

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

  const getDataFromXlsx = async () => {
    const workbookFile = './test.xlsx';
    const nameOfSheet = 'ws-test1';

    let workbook = new excel.Workbook();
    await workbook.xlsx.readFile(workbookFile);
    const sheet = workbook.getWorksheet(nameOfSheet);
    let json = sheetToJson(sheet, { headerRowNumber: 2 });
    console.log(json);
  };

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files[0], 'filefile');

    const buffer = await fileToBuffer(e.target.files[0]);

    let workbook = new excel.Workbook();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.getWorksheet(1);

    let json = sheetToJson({sheet});
    console.log(json);
  };

  return (
    <div>
      singers
      <input type='file' id='files' name='file' onChange={onChange} />
      <button onClick={() => readBlob()}>entire file</button>
      <div id='crypto_sha256'></div>
      {list.length > 0 ? list[0].name : ''}
      {/* <div onClick={() => generateFile(workbook)}>generate</div> */}
      <div onClick={getDataFromXlsx}>generate</div>
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
