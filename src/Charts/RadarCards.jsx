import React from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';

// Initialize the HighchartsMore module to enable radar chart
HighchartsMore(Highcharts);

const RadarCards = ({ userData, averageData, categories, scale }) => {
    const options = {
        chart: {
            polar: true,
            type: 'area'
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false // Disable Highcharts watermark
        },
        xAxis: {
            categories: categories || ['Skill A', 'Skill B', 'Skill C'] // Default categories
        },
        yAxis: {
            min: 0,
            max: scale || 10, // Default scale
            gridLineInterpolation: 'polygon',
            lineWidth: 0
        },
        plotOptions: {
            area: {
                fillOpacity: 0.5 // Set the fill opacity for the area inside the radar chart
            }
        },
        series: [
            {
                name: 'You',
                data: userData || [6, 4, 8], // Default user data
                pointPlacement: 'on',
                color: 'orange'
            },
            {
                name: 'Average',
                data: averageData || [5, 3, 7], // Default average data
                pointPlacement: 'on',
                color: 'gray'
            }
        ],
        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>'
        }
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default RadarCards;
