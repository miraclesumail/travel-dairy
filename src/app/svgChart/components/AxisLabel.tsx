/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-02-09 23:27:50
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-02-09 23:27:54
 * @FilePath: /travel-dairy/src/app/svgChart/components/AxisLabel.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { CSSProperties } from "react";

const style = {
  display: "inline-block",
  width: '100%',
  textAlign: 'center',
  color: "#808080",
};

const rotateStyles = {
  transform: "rotate(-90deg)",
  width: 35,
  transformOrigin: "center",
  marginTop: 50,
  marginRight: 20

}

const Label = ({text, rotate}: any) => (
  <div>
    <span style={{...style, ...(rotate ? rotateStyles : {})} as CSSProperties}>{text}</span>
  </div>
);

export default Label;