const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

const CHART_TRANS_COLORS = {
  red: 'rgb(255, 99, 132, 0.5)',
  orange: 'rgb(255, 159, 64, 0.5)',
  yellow: 'rgb(255, 205, 86, 0.5)',
  green: 'rgb(75, 192, 192, 0.5)',
  blue: 'rgb(54, 162, 235, 0.5)',
  purple: 'rgb(153, 102, 255, 0.5)',
  grey: 'rgb(201, 203, 207, 0.5)'
};

const NAMED_COLORS = [
  CHART_COLORS.red,
  CHART_COLORS.orange,
  CHART_COLORS.yellow,
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.grey,
];

const NAMED_TRANS_COLORS = [
  CHART_TRANS_COLORS.red,
  CHART_TRANS_COLORS.orange,
  CHART_TRANS_COLORS.yellow,
  CHART_TRANS_COLORS.green,
  CHART_TRANS_COLORS.blue,
  CHART_TRANS_COLORS.purple,
  CHART_TRANS_COLORS.grey,
];


const labels = ['0s', '', '10s', '', '20s', '', '30s','','40s','','50s','','60s'];
const data = {
  labels: labels,
  datasets: [{}],
};

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: false
    },
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        grid: {
          display: false
          },
        },
      }
    }
}
sportsCavas = document.getElementById('sportsChart').getContext('2d');
sportChart = new Chart(sportsCavas, config);

function showChart(chartDataset){
  data.datasets = chartDataset
  sportChart.update()
}