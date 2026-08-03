import { useState } from 'react'
import { MenuItem, Select, useMediaQuery } from '@mui/material'

/*
 * Solapas verticales al costado izquierdo (texto rotado) + panel a la derecha.
 * En pantallas chicas cae a un Select, igual que TabsMeter.
 * tabs: [{ key, label, component }]
 */
function VerticalTabs({ tabs }) {
	const [active, setActive] = useState(tabs[0]?.key)
	const isSmallScreen = useMediaQuery('(max-width: 900px)')
	const current = tabs.find((t) => t.key === active) ?? tabs[0]

	if (isSmallScreen) {
		return (
			<div className='w-full flex flex-col'>
				<Select
					value={active}
					onChange={(e) => setActive(e.target.value)}
					className='w-full mb-4 bg-white dark:bg-zinc-700 dark:text-white rounded-lg'
				>
					{tabs.map((tab) => (
						<MenuItem key={tab.key} value={tab.key}>
							{tab.label}
						</MenuItem>
					))}
				</Select>
				<div className='bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-500 rounded-2xl p-4 shadow-sm'>
					{current?.component}
				</div>
			</div>
		)
	}

	return (
		<div className='w-full flex flex-row min-h-[520px]'>
			<div className='flex flex-col w-11 flex-shrink-0 pt-2.5 gap-2'>
				{tabs.map((tab) => (
					<button
						key={tab.key}
						onClick={() => setActive(tab.key)}
						className={`[writing-mode:vertical-rl] rotate-180 rounded-r-xl border border-r-0 py-5 px-2 text-[13px] font-bold tracking-wide transition-colors select-none ${
							active === tab.key
								? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-300 border-gray-200 dark:border-zinc-500 -mr-px z-10 shadow'
								: 'bg-gray-300 dark:bg-zinc-500 text-gray-700 dark:text-zinc-200 border-gray-300 dark:border-zinc-500 hover:bg-gray-400 dark:hover:bg-zinc-400'
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className='flex-1 min-w-0 bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-500 rounded-r-2xl rounded-bl-2xl p-5 shadow-sm'>
				{current?.component}
			</div>
		</div>
	)
}

export default VerticalTabs
