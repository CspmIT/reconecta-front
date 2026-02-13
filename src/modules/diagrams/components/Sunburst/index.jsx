import { useEffect, useState } from "react"
import SunburstChildren from "./children"
import { Button, TextField } from "@mui/material"
import SunburstChart from "../sunburstChart"
import { request } from "../../../../utils/js/request"
import { backend } from "../../../../utils/routes/app.routes"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"


const SunburstGenerate = () => {
    const navigate = useNavigate()
    const [equipments, setEquipments] = useState([])
    const [nameGraphic, setNameGraphic] = useState(null)
    const [unitGraphic, setUnitGraphic] = useState(null)
    /* const [numTree, setNumTree] = useState(0) */
    const [tree, setTree] = useState([{ main: true, name: "", value: 100, children: [] }])
    const [recalculate, setRecalculate] = useState(false)

    /* const handleNewTree = () => {
        const newNum = numTree + 1
        setTree(prev => [...prev, { id: newNum, name: "", value: 100, children: [] }])
        setNumTree(newNum)
    }

    const handleDelete = (id) => {
        const newTrees = tree.filter(item => item.id !== id)
        setTree(newTrees)
    } */

    const getEquipments = async () => {
        const response = await request(`${backend.Reconecta}/Equipments`, 'GET')
        const analyzers = response.data.filter(item => item.id_model === 8 || item.id_model === 9)
        setEquipments(analyzers)
    }

    const handleColor = (event, id) => {
        const editTree = tree.map(item => {
            if (item.id === id) {
                item.itemStyle = { color: event.target.value }
            }
            return item
        })
        setTree(editTree)
    }

    const getMaxValue = () => {
        // Función recursiva para recorrer el árbol
        const calculateValues = (node) => {
            // Si no tiene hijos, simplemente retorna el valor actual
            if (!node.children || node.children.length === 0) {
                return parseFloat(node.value || 0);
            }

            // Si el nodo no tiene topic, recalcula su valor con la suma de sus hijos
            const sum = node.children.reduce((acc, child) => {
                const updatedChildValue = calculateValues(child);
                child.value = parseFloat(updatedChildValue).toFixed(2); // actualiza por si los hijos también cambian
                return acc + parseFloat(updatedChildValue);
            }, 0);

            // Solo actualiza el valor si el topic es null o vacío
            if (!node.topic && node.topic !== 0) {
                node.value = parseFloat(sum).toFixed(2);
            }

            return parseFloat(node.value);
        };

        const treeUpdated = { ...tree[0] };
        calculateValues(treeUpdated);
        setRecalculate(false)
        setTree([treeUpdated])
    }

    const saveGraphic = async () => {
        if (nameGraphic === null) {
            Swal.fire({
                title: "Atención",
                html: "Debe añadir un nombre al gráfico",
                icon: "warning",
            })
            return
        }
        const body = {
            name: nameGraphic,
            type: 1,
            unit: unitGraphic,
            data: tree
        }
        try {
            await request(`${backend.Reconecta}/Sunburst`, "POST", body)
            Swal.fire({
                title: "Perfecto",
                html: "El gráfico se guardo correctamente",
                icon: "success",
            })
            navigate("/Diagram")
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getEquipments()
    }, [])

    useEffect(() => {
        if (!recalculate) return
        getMaxValue()
    }, [tree])
    return (
        <>
            <div className="p-4 flex justify-center">
                {tree.map((node, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div>
                            <TextField className="w-3/4" variant="outlined" label="Nombre del gráfico" value={nameGraphic} onChange={(e) => { setNameGraphic(e.target.value) }} />
                            <TextField className="w-1/4" variant="outlined" label="Unidad" value={unitGraphic} onChange={(e) => { setUnitGraphic(e.target.value) }} />
                        </div>
                        <SunburstChildren
                            equipments={equipments}
                            node={node}
                            handleColor={handleColor}
                            onChange={(newNode) => {
                                const updated = [...tree];
                                updated[index] = newNode;
                                setRecalculate(true)
                                setTree(updated);
                            }} />
                        {/* {index !== 0 && (
                            <Button variant="contained" color="error" className="w-1/2" onClick={() => handleDelete(node.id)}>Borrar rama</Button>
                        )} */}
                    </div>
                ))}
                {/* <div>
                    <Button variant="contained" color="primary" onClick={handleNewTree}>Nueva rama</Button>
                </div> */}
            </div>
            <div className="w-full h-[60vh] text-center py-5 min-h-96">
                <b className="text-xl text-center p-5">Vista previa</b>
                <SunburstChart data={tree} unit={unitGraphic} />
            </div>
            <div>
                <Button onClick={saveGraphic} variant="contained" color="primary">Guardar gráfico</Button>
            </div>
        </>
    )
}

export default SunburstGenerate