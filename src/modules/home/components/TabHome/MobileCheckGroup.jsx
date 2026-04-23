const MobileCheckGroup = ({ title, options, values, onToggle }) => {
    return (
        <>
            <label className='italic text-black dark:text-white'>{title}</label>
            {options.map((opt) => (
                <label key={opt.value} className='flex items-center my-2'>
                    <input
                        type='checkbox'
                        className={`mr-2 !w-6 !h-6 ${opt.color ?? ''}`}
                        checked={!!values[opt.value]}
                        onChange={() => onToggle(opt.value)}
                    />
                    <b className='text-black dark:text-white'>{opt.label}</b>
                </label>
            ))}
        </>
    )
}
export default MobileCheckGroup