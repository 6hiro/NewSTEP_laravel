import React from 'react'
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart: React.FC<{
  state: {
    todo: number;
    inProgress: number;
    done: number;
  }
}> = (props) => {
  const data = {
    labels: ["Done", "InProgress", "todo"],
    datasets: [
      {
        data: [props.state.done, props.state.inProgress, props.state.todo],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",

        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{width: "300px", margin: "10px auto 20px auto"}}>
      {props.state.done+props.state.inProgress+props.state.todo>0 &&
        <Doughnut data={data}/>
      }
    </div>

  )
}

export default DoughnutChart