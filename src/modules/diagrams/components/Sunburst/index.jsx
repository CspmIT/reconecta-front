import { useState } from "react"
import SunburstChildren from "./children"
import { Button } from "@mui/material"
import SunburstChart from "../sunburstChart"


const SunburstGenerate = () => {
    const [tree, setTree] = useState([{ name: "", value: 100, children: [] }])
    const [show, setShow] = useState(false)
    const showGraphic = () => {
        setShow(true)
    }
    const handleNewTree = () => {
        setTree(prev => [...prev, { name: "", value: 100, children: [] }])
    }
    return (
        <>
            <div className="p-4 flex justify-center">
                {tree.map((node, index) => (
                    <SunburstChildren
                        key={index}
                        node={node}
                        onChange={(newNode) => {
                            const updated = [...tree];
                            updated[index] = newNode;
                            setTree(updated);
                        }} />
                ))}
                <div>
                    <Button variant="contained" color="primary" onClick={handleNewTree}>Nueva rama</Button>
                </div>
            </div>
            <div className="w-full flex justify-center">
                <Button variant="contained" color="primary" onClick={showGraphic}>Mostrar</Button>
            </div>
            <div className="w-96 h-56">
            {show && <SunburstChart data={tree} />}
            </div>
        </>
    )
}

export default SunburstGenerate