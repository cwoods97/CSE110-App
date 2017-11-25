import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            width: props.width,
            height: props.height,
            displayTitle: props.displayTitle,
            displayLegend: props.displayLegend,
            titleSize: props.titleSize,
            maxY: props.maxY
        }
    }

    static defaultProps = {
        title: 'Predefined Feedback',
        width: 200,
        height: 200,
        displayTitle: true,
        displayLegend: false,
        titleSize: 25,
        maxY: 20
    }

    componentWillMount() {
        this.buildChart();
    }

    buildChart() {
        this.setState({
            chartData: {
                labels: ['Label 1', 'Label 2'],
                datasets: [
                    {
                        label: 'Votes',
                        data: [
                            0,
                            0
                        ],
                        backgroundColor: ['rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)'],

                        borderColor: ['rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)'],

                        borderWidth: 1
                    }
                ]
            }
        });
    }

    render() {
        return (
            <Bar
                data={this.state.chartData}
                options={{
                    title: {
                        display: this.props.displayTitle,
                        text: this.props.title,
                        fontSize: this.props.titleSize
                    },
                    legend: {
                        display: this.props.displayLegend
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
                                suggestedMax: this.props.maxY,
                                beginAtZero: true
                            }
                        }]
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    width: this.props.width,
                    height: this.props.height
                }}
            />
        )
    }
}

export default Chart;