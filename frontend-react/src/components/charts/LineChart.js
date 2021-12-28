import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


const LineChart = () => {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June'];

    const data = {
        labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: [1,2,3,4,5,3],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Dataset 2',
            data: [3,4,6,8,7,5],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
    return <Line
    data={data}
  />
};

export default LineChart;
