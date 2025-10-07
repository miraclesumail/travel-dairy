/*
 * @Author: sumail sumail@xyzzdev.com
 * @Date: 2025-02-09 23:26:31
 * @LastEditors: sumail sumail@xyzzdev.com
 * @LastEditTime: 2025-02-09 23:40:18
 * @FilePath: /travel-dairy/src/app/svgChart/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import LineChart from './components/LineChart';
import Label from './components/AxisLabel';
import ChartTitle from './components/ChartTitle';

const data = [
  { label: 'S', x: 0, y: 0 },
  { label: 'M', x: 1, y: 400 },
  { label: 'T', x: 2, y: 300 },
  { label: 'W', x: 3, y: 100 },
  { label: 'TH', x: 4, y: 800 },
  { label: 'F', x: 5, y: 500 },
  { label: 'S', x: 6, y: 400 },
];

const styles = {
  chartComponentsContainer: {
    display: 'grid',
    gridTemplateColumns: 'max-content 700px',
    alignItems: 'center',
  },
  chartWrapper: { maxWidth: 700, alignSelf: 'flex-start' },
};

function App() {
  return (
    <div style={styles.chartComponentsContainer}>
      <div />
      <ChartTitle text='Movements per Day of the Week' />
      <Label text='Movements' rotate />
      <div style={styles.chartWrapper}>
        <LineChart width={500} height={300} data={data} horizontalGuides={5} precision={2} verticalGuides={3} />
      </div>
      <div />
      <Label text='Days of the Week' />
    </div>
  );
}

export default App;
