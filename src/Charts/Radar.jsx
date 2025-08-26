import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';

// Initialize the HighchartsMore module to enable radar chart
HighchartsMore(Highcharts);

const RadarChart = ({ userData, averageData, categories, scale }) => {
    const options = {
        chart: {
            polar: true,
            type: 'area'
        },
        title: {
            text: 'User Skill Distribution'
        },
        credits: {
            enabled: false // Disable Highcharts watermark
        },
        xAxis: {
            categories: categories || ['Speaking', 'Grammar', 'Memory', 'Speed', 'Listening']
        },
        yAxis: {
            min: 0,
            max: scale||10,
            gridLineInterpolation: 'polygon',
            lineWidth: 0
        },
        plotOptions: {
            area: {
                fillColor: 'rgba(10, 10, 10, 0.3)' // Set the fill color for the area inside the radar chart
            }
        },
        series: [
            {
                name: 'You',
                data: userData || [5, 3, 4, 7, 10], // Default values
                pointPlacement: 'on',
                color: 'orange'
            },
            {
                name: 'Average',
                data: averageData || [5, 5, 5, 5, 5],
                pointPlacement: 'on',
                color: 'gray'
            }
        ]
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default RadarChart;