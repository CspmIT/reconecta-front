import { useState } from 'react';

const DropdownCheckbox = ({ title, options, values, onToggle }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="hidden relative md:inline-block text-left w-1/4 px-2">
            <button
                onClick={() => setOpen(!open)}
                className="w-full inline-flex justify-between items-center rounded-xl border-2 border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-4 text-sm font-bold text-black dark:text-white shadow-sm"
            >
                {title}
            </button>

            {open && (
                <div className="absolute z-10 mt-2 w-full rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 shadow-lg p-2">
                    {options.map(({ label, value, color }) => (
                        <label
                            key={value}
                            className="flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={values[value]}
                                onChange={() => onToggle(value)}
                                className={`mr-2 h-4 w-4 rounded ${color ?? 'accent-blue-600'}`}
                            />
                            <span className="text-black dark:text-white">{label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};
export default DropdownCheckbox;