

const SunburstChildren = ({ node, onChange }) => {
    const handleChange = (key, value) => {
        onChange({ ...node, [key]: value });
    };

    const handleChildChange = (childIndex, newChild) => {
        const updatedChildren = node.children?.slice() || [];
        updatedChildren[childIndex] = newChild;
        onChange({ ...node, children: updatedChildren });
    };

    const addChild = () => {
        const updatedChildren = node.children ? [...node.children] : [];
        updatedChildren.push({ name: '', value: 1 });
        onChange({ ...node, children: updatedChildren });
    };

    return (
        <div className="border p-2 m-2 rounded bg-gray-100">
            <input
                className="border p-1 m-1"
                type="text"
                placeholder="Nombre"
                value={node.name}
                onChange={(e) => handleChange('name', e.target.value)}
            />
            <input
                className="border p-1 m-1 w-16"
                type="number"
                placeholder="Valor"
                value={node.value ?? ''}
                onChange={(e) => handleChange('value', Number(e.target.value))}
            />
            <button
                className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded"
                onClick={addChild}
            >
                + Hijo
            </button>

            <div className="ml-4 mt-2">
                {node.children?.map((child, i) => (
                    <SunburstChildren
                        key={i}
                        node={child}
                        onChange={(newChild) => handleChildChange(i, newChild)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SunburstChildren;