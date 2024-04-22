export function CustomTabPanel(props) {
    const { children, value, index, ...other } = props
    return (
        <div role='tabpanel' key={other.key} hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <div {...other}>{children}</div>}
        </div>
    )
}

export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}
