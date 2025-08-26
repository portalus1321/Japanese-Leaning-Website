import React, { useEffect } from 'react';
import Highcharts from 'highcharts';

export default function Curves() {
    useEffect(() => {
        Highcharts.chart('splineChart', {
            chart: {
                type: 'line',
                backgroundColor: 'white' // Set background color of the chart
            },
            title: {
                text: 'result',
                style: {
                    fontFamily: 'Arial',
                    fontSize: '16px',
                    color: 'purple'
                }
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                labels: {
                    style: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
                        color: 'purple'
                    }
                } // Set x-axis grid lines color to yellow
            },
            yAxis: {
                title: {
                    text: 'Data',
                    style: {
                        fontFamily: 'Arial',
                        fontSize: '12px',
                        color: 'purple'
                    }
                },
                labels: {
                    style: {
                        fontFamily: 'Arial',
                        fontSize: '10px',
                        color: 'black'
                    }
                },
                gridLineColor: 'black' // Set y-axis grid lines color to yellow
            },
            credits: {
                enabled: false // Disable Highcharts watermark
            },
            plotOptions: {
                series: {
                    color: 'purple' // Set default line color for all series
                }
            },
            series: [{
                name: 'Series 1',
                color: 'blue', // Set line color for Series 1
                data: [null, 12, 15, 25, 18, 30]
            }, {
                name: 'Series 2',
                color: 'orange', // Set line color for Series 2
                data: [5, 15, 10, 20, 12, 25]
            }]
        });
    }, []);

    return (
        <div className='w-full h-full'  id="splineChart"></div>
    );
};
