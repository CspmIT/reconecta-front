import { color } from "echarts";
import EChart from "../../../components/Charts";

const SunburstChart = ({ data }) => {

    const option = {
        silent: true,
        series: {
            type: 'sunburst',
            data: data,
            radius: [0, '90%'],
        },
        label: {
            color: '#000',
            fontStyle: "bold",
            textBorderColor: '#fff',
            textBorderWidth: 2,
            overflow: 'break', // opciones: 'truncate', 'break', 'breakAll', 'none'
            width: 80,
        },
    };
    return (
        <EChart config={option} />
    )
}

export default SunburstChart