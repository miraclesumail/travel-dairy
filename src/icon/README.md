# icon package

## Usage

1. 複製所有 SVG 檔案至 `./svg-files/` 資料夾
2. 執行 `convert.js` 進行轉換
    ```shell
    cd packages/icon/
    node convert.js
    ```

## 非 Monotone SVG 檔案

將名單加入 `./config/hardcore.js` 中，再執行 `convert.js` 即可。

## Storybook

轉換時會另外產出一份所有 icon 的 class list 在 [output/icon-list.json](./output/icon-list.json) 給 Storybook 使用。