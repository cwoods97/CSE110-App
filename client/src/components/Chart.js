/*
 * Before using this file, type
 * 'npm install react-chartjs-2 chart.js --save'
 *
 * Pass in various props (listed in the constructor) to the <Chart /> tag to
 * edit certain aspects of the chart.
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Bar} from 'react-chartjs-2';

 /*
     * Function to decide color of bar based on type
     */
function backgroundColors(type) {
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
function borderColors(type) {
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

var chart1 = {
    labels: ['Slow Down Pace', 'Speed Up Pace'],
    datasets: [{
        data: [0,0],
        label: 'Votes',
        backgroundColor: backgroundColors(1),
        borderColor: borderColors(1),
        borderWidth: 1
    }]
}

var chart2 = {
    labels: ['Speak Softer', 'Speak Louder'],
    datasets: [{
        data: [0,0],
        label: 'Votes',
        backgroundColor: backgroundColors(1),
        borderColor: borderColors(1),
        borderWidth: 1
    }]
}

var chart3 = {
    labels: ['Speak Slower', 'Speak Faster'],
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

        this.db = props.db;
        this.sessionID = props.sessionID;
        this.type = props.type;

        // console.log(chart);

        this.state = {
            // chartData: chart,
            chartData1: chart1,
            chartData2: chart2,
            chartData3: chart3
        };

        var type = this.type;

        var chartData = this.state.chartData;
        var chartData1 = this.state.chartData1;
        var chartData2 = this.state.chartData2;
        var chartData3 = this.state.chartData3;

        this.chartData = this.state.chartData;
        this.title = "";
        if(type == "pace"){
            this.chartData = this.state.chartData1;
            this.title = "Pace of Speech";
        }else if(type == "volume"){
            this.chartData = this.state.chartData2;
            this.title = "Volume";
        }else if(type == "speed"){
            this.chartData = this.state.chartData3;
            this.title = "Speed"
        }

        // if(type == "pace"){
        //     chartData = this.state.chartDataPace;
        // }

        // var chartDataPace = this.state.chartDataPace;
        // var chartDataVolume = this.state.chartDataVolume;
        // var chartDataSpeed = this.state.chartDataSpeed;

        // console.log(type);

        // ***must keep function inside feedbackRef.on for access to updating
        // function handleFeedback(snapshot){
        //     if(type == 'pace'){
        //         var parsedFeedback = snapshot.val();
        //         if(parsedFeedback.type == 0){
        //             if(parsedFeedback.message == "fast"){
        //                 chartData.datasets[0].data[0]++;
        //                 console.log("fast");
        //             }else if(parsedFeedback.message == "slow"){
        //                 chartData.datasets[0].data[1]++;
        //                 console.log("slow");
        //             }
        //         } 
        //         console.log(chartData);
        //         }
        // }


        var feedbackRef = this.db.database().ref("feedback").child(this.sessionID);
        feedbackRef.on("child_added", function(snapshot, prevChildKey){
                if(type == 'pace'){
                    var parsedFeedback = snapshot.val();
                    if(parsedFeedback.type == 0){
                        if(parsedFeedback.message == "slow"){
                            this.state.chartData1.datasets[0].data[0]++;
                        }else if(parsedFeedback.message == "fast"){
                            this.state.chartData1.datasets[0].data[1]++;
                        }
                    } 
                    this.setState({chartData1});
                }else if(type == 'volume'){
                    var parsedFeedback = snapshot.val();
                    if(parsedFeedback.type == 0){
                        if(parsedFeedback.message == "quiet"){
                            this.state.chartData2.datasets[0].data[0]++;
                        }else if(parsedFeedback.message == "loud"){
                            this.state.chartData2.datasets[0].data[1]++;
                        }
                    } 
                    this.setState({chartData2});
                }else if(type == 'speed'){
                    var parsedFeedback = snapshot.val();
                    if(parsedFeedback.type == 0){
                        if(parsedFeedback.message == "tslow"){
                            this.state.chartData3.datasets[0].data[0]++;
                        }else if(parsedFeedback.message == "tfast"){
                            this.state.chartData3.datasets[0].data[1]++;
                        }
                    } 
                    this.setState({chartData3});
                }
                console.log("pace dataset: " + this.state.chartData1.datasets[0].data[0] + this.state.chartData1.datasets[0].data[1]);
                console.log("volume dataset: " + this.state.chartData2.datasets[0].data[0] + this.state.chartData2.datasets[0].data[1]);
                console.log("speed dataset: " + this.state.chartData3.datasets[0].data[0] + this.state.chartData3.datasets[0].data[1]);
        }.bind(this));
    }


    /*
     * Defined default props, if no props are passed in
     */
    // static defaultProps = {
    //     title: 'Predefined Feedback',
    //     labels: ['Label 1', 'Label 2'],
    //     data: [0,0],
    //     width: 200,
    //     height: 200,
    //     type: 1
    // }

    render() {
        return (
            <Bar 
                data={this.chartData} 
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
