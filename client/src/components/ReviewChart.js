/*
 * Before using this file, type
 * 'npm install react-chartjs-2 chart.js --save'
 *
 * Pass in various props (listed in the constructor) to the <Chart /> tag to
 * edit certain aspects of the chart.
 */

import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

 /*
 * Function to decide color of bar based on type
 */
function backgroundColors(type) {
        if (type === 1) {
            return ['rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)'];
        } else if (type === 2) {
            return ['rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'];
        } else {
            return ['rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)'];
        }
    }

    /*
     * Function to decide color of bar border based on type
     */
function borderColors(type) {
        if (type === 1) {
            return ['rgb(255, 99, 132)',
            'rgb(255, 159, 64)'];
        } else if (type === 2) {
            return ['rgb(255, 205, 86)',
            'rgb(75, 192, 192)'];
        } else {
            return ['rgb(54, 162, 235)',
            'rgb(153, 102, 255)'];
        }
    }

/*
 * The first chart represents whether the speaker is going too fast or too slow
 */
var chart1 = {
    labels: ['Slow', 'Fast'],
    datasets: [{
        data: [0,0],
        label: 'Votes',
        backgroundColor: backgroundColors(1),
        borderColor: borderColors(1),
        borderWidth: 1
    }]
}
/*
 * The second chart represents whether the speaker is talking too loud or quiet
 */
var chart2 = {
    labels: ['Quiet', 'Loud'],
    datasets: [{
        data: [0,0],
        label: 'Votes',
        backgroundColor: backgroundColors(1),
        borderColor: borderColors(1),
        borderWidth: 1
    }]
}
/*
 * The third chart represents whether the speaker is being clear or unclear
 */
var chart3 = {
    labels: ['Unclear', 'Clear'],
    datasets: [{
        data: [0,0],
        label: 'Votes',
        backgroundColor: backgroundColors(1),
        borderColor: borderColors(1),
        borderWidth: 1
    }]
}

class Chart extends Component {

    constructor(props) {
        super(props);

		// initializes the chart with the specific type (pace, volume, or clarity)
        this.db = props.db;
        this.sessionID = props.sessionID;
        this.type = props.type;

        this.state = {
            chartData1: chart1,
            chartData2: chart2,
            chartData3: chart3
        };

        var type = this.type;

        this.chartData = this.state.chartData;
        this.title = "";
        if(type === "pace"){
            this.chartData = this.state.chartData1;
            this.title = "Rate of Speech";
        }else if(type === "volume"){
            this.chartData = this.state.chartData2;
            this.title = "Volume";
        }else if(type === "clarity"){
            this.chartData = this.state.chartData3;
            this.title = "Clarity";
        }
    }

	setGraph(feedbackArray) {
		var type = this.type;
        var chartData1 = this.state.chartData1;
        var chartData2 = this.state.chartData2;
        var chartData3 = this.state.chartData3;

		// updates the graph depending on the type of the graph
        if (type === 'pace') {
            this.state.chartData1.datasets[0].data[0]=feedbackArray[0];
            this.state.chartData1.datasets[0].data[1]=feedbackArray[1];
            this.setState({chartData1});
        } else if (type === 'volume') {
            this.state.chartData2.datasets[0].data[0]=feedbackArray[2];
            this.state.chartData2.datasets[0].data[1]=feedbackArray[3];
            this.setState({chartData2});
        } else if (type === 'clarity') {
			this.state.chartData3.datasets[0].data[0]=feedbackArray[4];
			this.state.chartData3.datasets[0].data[1]=feedbackArray[5]
            this.setState({chartData3});
        }
	}

    render() {
        return (
            <Bar
                data={this.chartData}
				//default chart characteristics
                options={{
                    title: {
                        display: true,
                        text: this.title,
                        fontSize: 25
                    },
                    legend: {
                        display: false
                        },
                    scales: {
                        xAxes: [{
                            display: true,
                            categoryPercentage: 0.5,
                            barPercentage: 0.8,
                        }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMax: 20,
                                beginAtZero: true
                            }
                        }]
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    onClick: function () {
                        this.data.datasets[0].data[0] = 0;
                        this.data.datasets[0].data[1] = 0;
                        this.update();
                    },
                    width: this.props.width,
                    height: this.props.height
                }}
            />
        )
    }
}

export default Chart;
