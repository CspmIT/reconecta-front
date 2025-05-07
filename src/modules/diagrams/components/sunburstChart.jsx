import EChart from "../../../components/Charts";

const SunburstChart = ({ data }) => {

    const option = {
        visualMap: {
            type: 'continuous',
            min: 0,
            max: 100,
            inRange: {
                color: ['#2F93C8', '#AEC48F', '#FFDB5C', '#F98862']
            }
        },
        series: {
            type: 'sunburst',
            data: data,
            radius: [0, '90%'],
            label: {
                rotate: 'radial'
            }
        }
    };
    return (
        <EChart config={option} />
    )
}

export default SunburstChart