import EChart from "../../../components/Charts";

const SunburstChart = ({ data, unit = null }) => {
    const unitFormated = unit !== null ? unit : ""
    const option = {
        silent: true,
        series: {
            type: 'sunburst',
            data: data,
            radius: [0, '90%'],
        },
        label: {
            rotate: 'radial',
            show: true,
            formatter: (params) => `${params.data.name}\n${parseFloat(params.data.value).toFixed(2)} ${unitFormated}`,
            color: '#000',
            fontStyle: "bold",
            textBorderColor: '#fff',
            textBorderWidth: 3,
            overflow: 'break',
            width: 80,
        },
    };
    return (
        <EChart config={option} />
    )
}

export default SunburstChart