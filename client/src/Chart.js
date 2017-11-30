/*
 * Before using this file, type
 * 'npm install react-chartjs-2 chart.js --save'
 *
 * Pass in various props (listed in the constructor) to the <Chart /> tag to
 * edit certain aspects of the chart.
 */

import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

class Chart extends Component {

    constructor(props) {
        super(props);

        this.db = props.db;
        this.sessionID = props.sessionID;
        this.type = props.type;

        this.state = {
            chartData: {
                labels: this.props.labels,
                datasets: [{
                    data: this.props.data,
                    label: 'Votes',
                    backgroundColor: this.backgroundColors(this.props.type),
                    borderColor: this.borderColors(this.props.type),
                    borderWidth: 1
                }]
            }
        };

        var type = this.type;
        var chartData = this.state.chartData;
        function handleFeedback(snapshot){
            if(type == 'pace'){
                var parsedFeedback = snapshot.val();
                if(parsedFeedback.type == 0){
                    if(parsedFeedback.message == "slow"){
                        chartData.datasets[0].data[0]++;
                    }else if(parsedFeedback.message == "fast"){
                        chartData.datasets[0].data[1]++;
                    }
                    this.update()
                } 
                }
        }

        var feedbackRef = this.db.database().ref("feedback").child(this.sessionID);
        feedbackRef.on("child_added", function(snapshot, prevChildKey){
                handleFeedback(snapshot);
        });
    }


    /*
     * Defined default props, if no props are passed in
     */
    static defaultProps = {
        title: 'Predefined Feedback',
        labels: ['Label 1', 'Label 2'],
        data: [12, 5],
        width: 200,
        height: 200,
        type: 1
    }

    /*
     * Function to decide color of bar based on type
     */
    backgroundColors(type) {
        if (type == 1) {
            return ['rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)'];
        } else if (type == 2) {
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
    borderColors(type) {
        if (type == 1) {
            return ['rgb(255, 99, 132)',
            'rgb(255, 159, 64)'];
        } else if (type == 2) {
            return ['rgb(255, 205, 86)',
            'rgb(75, 192, 192)'];
        } else {
            return ['rgb(54, 162, 235)',
            'rgb(153, 102, 255)'];
        }
    }

    render() {
        return (
            <Bar
                data={this.state.chartData}
                options={{
                    title: {
                        display: this.props.displayTitle,
                        text: this.props.title,
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
                        console.log(this.update);
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
