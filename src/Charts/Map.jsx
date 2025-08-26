import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsMap from 'highcharts/modules/map';
import HighchartsReact from 'highcharts-react-official';

// Initialize the Highmaps module
HighchartsMap(Highcharts);

const MapChartComponent = () => {
    useEffect(() => {
        (async () => {
            const topology = await fetch(
                'https://code.highcharts.com/mapdata/custom/world.topo.json'
            ).then(response => response.json());

            Highcharts.mapChart('container', {
                chart: {
                    map: topology
                },

                title: {
                    text: 'Average Japanese Proficiency Level by Country',
                    align: 'left'
                },

                credits: {
                    href: 'https://data.source.com',
                    text: 'Data source: Your Source Here'
                },

                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },

                colorAxis: {
                    min: 0,
                    max: 100,
                    stops: [
                        [0, '#F9EDB3'],
                        [0.5, '#FFC107'],
                        [1, '#7CB5EC']
                    ]
                },

                series: [{
                    data: [
                        { 'hc-key': 'us', value: 80 }, // Example data: United States proficiency level
                        { 'hc-key': 'jp', value: 90 } // Example data: Japan proficiency level
                        // Add more countries and proficiency levels as needed
                    ],
                    keys: ['hc-key', 'value'],
                    joinBy: 'hc-key',
                    name: 'Proficiency Level',
                    dataLabels: {
                        enabled: true,
                        format: '{point.value}',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                }]
            });
        })();
    }, []);

    return <div id="container"></div>;
};

export default MapChartComponent