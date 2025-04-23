import { useState } from "react";
import EChart from "../../../../../../components/Charts";

const MeterLineChart = ({ values, title }) => {
    const maxLabels = 24
    const time = values.DatePeriod
    const interval = Math.ceil(time.length / maxLabels)
    const [autoScale, setAutoScale] = useState(false)
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
            data: time,
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
                myAutoScale: {
                    show: true,
                    title: autoScale ? 'Desactivar autoescalado' : 'Activar autoescalado',
                    icon: 'path://M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 30-45.3l-64-64z',
                    onclick: () => setAutoScale(prev => !prev),
                    iconStyle: {
                        color: autoScale ? '#4dffff' : '#999966',
                    }
                }
            },
        },
        yAxis: {
            type: 'value',
            ...(autoScale ? { min: 'dataMin', max: 'dataMax' } : {}),
        },
        series: Object.keys(values).map((key) => {
            if (key !== 'DatePeriod') {
                return {
                    name: key,
                    type: 'line',
                    data: values[key],
                    smooth: true,
                }
            }
        }
        ),
    };
    return (
        <EChart config={option} />
    )
}

export default MeterLineChart