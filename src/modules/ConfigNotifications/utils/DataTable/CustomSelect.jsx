import { useState, useRef, useEffect } from 'react';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const CustomSelect = ({ value }) => {
    const [selected, setSelected] = useState({
        value: 3,
        label: 'SIN PRIORIDAD',
        icon: <FaInfoCircle />,
    });
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        { value: 1, label: 'Alta', icon: <FaExclamationTriangle size={25} className="text-red-600" /> },
        { value: 2, label: 'Baja', icon: <FaExclamationTriangle size={25} className="text-yellow-500" /> },
        { value: 3, label: 'Sin prioridad', icon: <FaInfoCircle size={25} className="text-blue-500" /> },
    ];

    // Cierra el menú si se hace clic fuera
    useEffect(() => {
        if (value) {
            setSelected(options.find(option => option.value === value))
        }
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-24" ref={dropdownRef}>
            <button
                className="w-full p-2 border bg-white rounded-md flex items-center justify-between gap-2 hover:bg-gray-50"
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className="flex items-center gap-2" title={selected?.label || ''}>
                    {selected?.icon || ''}
                </span>
                <span className="ml-auto">▾</span>
            </button>

            {open && (
                <ul className="absolute z-10 w-24 bg-white border mt-1 rounded-md shadow-lg">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => {
                                setSelected(option);
                                setOpen(false);
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            title={option.label}
                        >
                            {option.icon}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;