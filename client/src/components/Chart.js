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

var chart = {
    labels: ['test1', 'test2'],
    datasets: [{
        data: [0,0],
        label: 'Votes',
        backgroundColor: backgroundColors(1),
        borderColor: borderColors(1),
        borderWidth: 1
    },
    {
        data: [0,0],
        label: 'Votes',
        backgroundColor: backgroundColors(1),
        borderColor: borderColors(1),
        borderWidth: 1
    },
    {
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
            chartData: chart,
            chartData1: chart,
            chartData2: chart,
            chartData3: chart
        };

        var type = this.type;
        
        var chartData = this.state.chartData;
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
                    // chartData.datasets[0].data[0] = 0;
                    // chartData.datasets[0].data[1] = 0;
                    var parsedFeedback = snapshot.val();
                    if(parsedFeedback.type == 0){
                        if(parsedFeedback.message == "slow"){
                            this.state.chartData.datasets[0].data[0]++;
                        }else if(parsedFeedback.message == "fast"){
                            this.state.chartData.datasets[0].data[1]++;
                        }
                    } 
                    this.setState({chartData});
                }else if(type == 'volume'){
                    var parsedFeedback = snapshot.val();
                    if(parsedFeedback.type == 0){
                        if(parsedFeedback.message == "quiet"){
                            this.state.chartData.datasets[1].data[0]++;
                        }else if(parsedFeedback.message == "loud"){
                            this.state.chartData.datasets[1].data[1]++;
                        }
                    } 
                    this.setState({chartData});
                }else if(type == 'speed'){
                    var parsedFeedback = snapshot.val();
                    if(parsedFeedback.type == 0){
                        if(parsedFeedback.message == "tslow"){
                            this.state.chartData.datasets[2].data[0]++;
                        }else if(parsedFeedback.message == "tfast"){
                            this.state.chartData.datasets[2].data[1]++;
                        }
                    } 
                    this.setState({chartData});
                }
                console.log("pace dataset: " + this.state.chartData.datasets[0].data[0] + this.state.chartData.datasets[0].data[1]);
                console.log("volume dataset: " + this.state.chartData.datasets[1].data[0] + this.state.chartData.datasets[1].data[1]);
                console.log("speed dataset: " + this.state.chartData.datasets[2].data[0] + this.state.chartData.datasets[2].data[1]);
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
