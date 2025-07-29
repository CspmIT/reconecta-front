import { useState } from "react";
import { FaCheck, FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { backend } from "../../../../utils/routes/app.routes";
import { request } from "../../../../utils/js/request";


const SunburstChildren = ({ node, onChange, onDelete, equipments }) => {
    const isChild = typeof node.main === "undefined"
    const handleChange = (key, value) => {
        onChange({ ...node, [key]: value });
    };

    const handleTopic = async (e) => {
        const id = Number(e.target.value)
        const analyzer = equipments.find(equip => equip.id === id)
        const body = {
            brand: analyzer?.equipmentmodels?.name.toLowerCase(),
            version: analyzer?.equipmentmodels?.brand.toLowerCase(),
            serial: analyzer?.serial
        }
        const { data } = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/AnalyzerMonths`, 'POST', body)
        const lastKey = Math.max(...Object.keys(data));
        const lastEntry = data[lastKey];
        onChange({ ...node, topic: id, value: lastEntry.value })
    }

    const handleChildChange = (childIndex, newChild) => {
        const updatedChildren = node.children?.slice() || [];
        updatedChildren[childIndex] = newChild;
        onChange({ ...node, children: updatedChildren });
    };

    const addChild = () => {
        const updatedChildren = node.children ? [...node.children] : [];
        const pushElement = { name: '', value: 1, topic: '' }
        if (node.itemStyle?.color) {
            pushElement.itemStyle = { color: node.itemStyle.color }
        }
        updatedChildren.push(pushElement);
        onChange({ ...node, children: updatedChildren });
    };

    const handleChangeColor = (color) => {
        const updatedNode = {
            ...node,
            itemStyle: { color },
        };
        onChange(updatedNode);
    };

    const handleDeleteChild = (childIndex) => {
        const updatedChildren = node.children?.slice() || [];
        updatedChildren.splice(childIndex, 1);
        onChange({ ...node, children: updatedChildren });
    };

    return (
        <div className="border p-2 m-2 rounded bg-gray-100">
            <div className="flex items-center rounded">
                <input type="color" onChange={(e) => handleChangeColor(e.target.value, node)} className="border border-black" />
                <input
                    className="border p-1 m-1 border-black py-2"
                    type="text"
                    placeholder="Nombre"
                    value={node.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
                <input
                    className="border p-1 m-1 w-24 border-black py-2"
                    type="text"
                    placeholder="Valor"
                    value={node.value ?? ''}
                    onChange={(e) => handleChange('value', Number(e.target.value))}
                />
                <select disabled={!isChild} className="flex items-center border border-black p-1 m-1 py-2 rounded bg-white w-1/4" onChange={handleTopic}>
                    <option value={''}>Sumatoria</option>
                    {equipments.length > 0 && equipments.map(item => (
                        <option key={item.id} value={item.id}>{item.observation}</option>
                    ))}
                </select>
                <button
                    className="ml-2 text-sm bg-green-500 text-white p-3 rounded"
                    onClick={addChild}
                >
                    <FaPlusCircle />
                </button>
                {isChild && (
                    <button
                        className="ml-2 text-sm bg-red-500 text-white p-3 rounded"
                        onClick={onDelete}
                    >
                        <FaTimesCircle />
                    </button>
                )}
            </div>

            <div className="ml-4 mt-2">
                {node.children?.map((child, i) => (
                    <SunburstChildren
                        key={i}
                        node={child}
                        onChange={(newChild) => handleChildChange(i, newChild)}
                        onDelete={() => handleDeleteChild(i)}
                        equipments={equipments}
                    />
                ))}
            </div>
        </div>
    );
};

export default SunburstChildren;