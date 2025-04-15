import React from 'react'
import EChart from '../../../../../components/Charts';

const AnalyzerLineChart = ({ values, title }) => {
    const maxLabels = 24
    const interval = Math.ceil(values.time.length / maxLabels)
    const option = {
        title: {
            text: title
        },
        legend: {
        },
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: {
            visible: true,
            type: 'category',
            data: values.time,
            splitNumber: 5,
            axisLabel: {
                interval: interval,
                rotate: 30,
                showMinLabel: false
            }
        },
        toolbox: {
            feature: {
                dataZoom: { yAxisIndex: 'none' },
            },
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Fase R',
                data: values.R.values,
                type: 'line',
                smooth: true
            },
            {
                name: 'Fase S',
                data: values.S.values,
                type: 'line',
                smooth: true
            },
            {
                name: 'Fase T',
                data: values.T.values,
                type: 'line',
                smooth: true
            }
        ]
    };
    return (
        <EChart config={option} />
    )
}

export default AnalyzerLineChart