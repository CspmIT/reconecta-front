import { useEffect, useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { FaChevronDown, FaClipboardList } from 'react-icons/fa'
import TableCustom from '../../../../../../components/TableCustom'
import LoaderComponent from '../../../../../../components/Loader'
import ModalSummary from '../ModalSummary/ModalSummary'
import { request } from '../../../../../../utils/js/request'
import { backend } from '../../../../../../utils/routes/app.routes'
import { calculoTiempoDuracion } from '../../../../../../utils/js/formatDate'

/*
 * Sección colapsable de calidad de tensión: encabezado con contador
 * (eventos + duración total, agregado de por vida de los topics Re*),
 * botón "Ver resumen" (modal por fase) y tabla de antecedentes.
 */
function QualitySection({ info, config }) {
	const { title, Icon, iconClass, endpoint, summaryEndpoint, ColumnsTable, ColumnsTableModal, formatTable, formatModal, phases } = config
	const [collapsed, setCollapsed] = useState(true)
	const [openSummary, setOpenSummary] = useState(false)
	const [dataTable, setDataTable] = useState([])
	const [dataModal, setDataModal] = useState([])
	const [counter, setCounter] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState(false)

	const getData = async () => {
		try {
			setIsLoading(true)
			setLoadError(false)
			const body = {
				serial: info.serial,
				version: info.version,
				brand: info.brand,
				dateStart: null,
				dateFinished: null,
			}
			const base = backend[`${import.meta.env.VITE_APP_NAME}`]
			const [list, summary] = await Promise.all([
				request(`${base}${endpoint}`, 'POST', body),
				request(`${base}${summaryEndpoint}`, 'POST', body),
			])
			const rows = await formatTable(list.data)
			rows.sort((a, b) => new Date(b.datePeriod) - new Date(a.datePeriod))
			setDataTable(rows)
			setDataModal(await formatModal(summary.data))

			// Contador del encabezado a partir del resumen crudo (Eventos + tot por fase)
			try {
				const raw = summary.data
				if (!raw || raw === 'sin datos' || !Array.isArray(raw.Eventos)) {
					setCounter(null)
				} else {
					const idx = phases ? [0, 1, 2] : [0]
					const events = idx.reduce((acc, i) => acc + (parseInt(raw.Eventos?.[i]?.value) || 0), 0)
					const totalSec = idx.reduce((acc, i) => acc + (parseFloat(raw.tot?.[i]?.value) || 0), 0)
					setCounter({ events, total: calculoTiempoDuracion(totalSec) })
				}
			} catch (error) {
				setCounter(null)
			}
		} catch (error) {
			// Error inline en la seccion (sin Swal: con 4 secciones se apilaban los popups)
			console.error(error)
			setLoadError(true)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (info) getData()
	}, [info])

	return (
		<div className='w-full border border-gray-200 dark:border-zinc-500 rounded-xl overflow-hidden bg-white dark:bg-zinc-700 mb-4'>
			<div
				className='flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-50 dark:bg-zinc-600 border-b border-gray-200 dark:border-zinc-500 select-none'
				onClick={() => setCollapsed(!collapsed)}
			>
				<div className='flex items-center gap-3 text-lg font-bold'>
					<Icon className={iconClass} />
					<span>{title}</span>
					{counter && (
						<span className='text-xs font-medium text-gray-600 dark:text-zinc-200 bg-gray-200 dark:bg-zinc-500 px-2 py-0.5 rounded-full'>
							{counter.events.toLocaleString('es-AR')} eventos (histórico) · {counter.total} totales
						</span>
					)}
				</div>
				<div className='flex items-center gap-3'>
					<button
						onClick={(e) => {
							e.stopPropagation()
							setOpenSummary(true)
						}}
						disabled={!dataModal.length}
						title={!dataModal.length ? 'Sin resumen disponible para este medidor' : undefined}
						className='inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-zinc-500 border border-blue-200 dark:border-zinc-400 rounded-md px-2.5 py-1 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed'
					>
						<FaClipboardList /> Ver resumen
					</button>
					<FaChevronDown
						className={`text-gray-500 dark:text-zinc-300 transition-transform ${collapsed ? '-rotate-90' : ''}`}
					/>
				</div>
			</div>
			{!collapsed && (
				<div className='p-4'>
					{isLoading ? (
						<LoaderComponent image={false} />
					) : loadError ? (
						<p className='text-center italic text-red-600 dark:text-red-400 py-4'>
							No se pudieron cargar los datos de {title.toLowerCase()}. Intente recargar.
						</p>
					) : !dataTable.length ? (
						<p className='text-center italic text-gray-500 dark:text-zinc-300 py-4'>
							Sin antecedentes de {title.toLowerCase()} para este medidor.
						</p>
					) : (
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<TableCustom
								data={dataTable}
								columns={ColumnsTable}
								density='compact'
								header={{
									background: 'rgb(190 190 190)',
									fontSize: '18px',
									fontWeight: 'bold',
								}}
								card={{
									boxShadow: `1px 1px 8px 0px #00000046`,
									borderRadius: '0.25rem',
								}}
								toolbarClass={{ background: 'rgb(190 190 190)' }}
								body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
								footer={{ background: 'rgb(190 190 190)' }}
								pageSize={10}
								topToolbar
								filter
								pagination
							/>
						</LocalizationProvider>
					)}
				</div>
			)}
			<ModalSummary
				ColumnsTableModal={ColumnsTableModal}
				open={openSummary}
				handleClose={() => setOpenSummary(false)}
				dataTableModal={dataModal}
			/>
		</div>
	)
}

export default QualitySection
