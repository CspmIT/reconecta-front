import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { CircularProgress } from '@mui/material'
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
	// Filtro de fecha y hora de los antecedentes (mockup: Inicio / Fin / Filtrar)
	const [filterStart, setFilterStart] = useState('')
	const [filterEnd, setFilterEnd] = useState('')
	const [filterApplied, setFilterApplied] = useState(false)
	const [filterError, setFilterError] = useState(null)
	const [tableLoading, setTableLoading] = useState(false)

	const base = backend[`${import.meta.env.VITE_APP_NAME}`]
	const baseBody = {
		serial: info.serial,
		version: info.version,
		brand: info.brand,
		dateStart: null,
		dateFinished: null,
	}

	// Trae los antecedentes; range = {dateStart, dateFinished} en ISO o null (desde inicio de año)
	const fetchTable = async (range) => {
		const list = await request(`${base}${endpoint}`, 'POST', { ...baseBody, ...range })
		const rows = await formatTable(list.data)
		rows.sort((a, b) => new Date(b.datePeriod) - new Date(a.datePeriod))
		setDataTable(rows)
	}

	const applyFilter = async () => {
		if (!filterStart || !filterEnd) {
			setFilterError('Completá fecha y hora de inicio y fin')
			return
		}
		if (!dayjs(filterEnd).isAfter(dayjs(filterStart))) {
			setFilterError('El inicio debe ser anterior al fin')
			return
		}
		setFilterError(null)
		setTableLoading(true)
		try {
			await fetchTable({
				dateStart: dayjs(filterStart).toISOString(),
				dateFinished: dayjs(filterEnd).toISOString(),
			})
			setFilterApplied(true)
		} catch (error) {
			console.error(error)
			setFilterError('No se pudieron cargar los antecedentes del período')
		} finally {
			setTableLoading(false)
		}
	}

	const clearFilter = async () => {
		setFilterStart('')
		setFilterEnd('')
		setFilterError(null)
		setTableLoading(true)
		try {
			await fetchTable(null)
			setFilterApplied(false)
		} catch (error) {
			console.error(error)
			setFilterError('No se pudieron recargar los antecedentes')
		} finally {
			setTableLoading(false)
		}
	}

	const getData = async () => {
		try {
			setIsLoading(true)
			setLoadError(false)
			const [, summary] = await Promise.all([
				fetchTable(null),
				request(`${base}${summaryEndpoint}`, 'POST', baseBody),
			])
			setDataModal(await formatModal(summary.data))

			// Contador del encabezado a partir del resumen crudo. Las secciones por fase
			// publican 'Eventos'; interrupciones (ReInt) publica 'Ev_breves' + 'Ev_prolon'.
			try {
				const raw = summary.data
				const idx = phases ? [0, 1, 2] : [0]
				const sumField = (field) =>
					idx.reduce((acc, i) => acc + (parseFloat(raw?.[field]?.[i]?.value) || 0), 0)
				if (!raw || raw === 'sin datos') {
					setCounter(null)
				} else if (Array.isArray(raw.Eventos)) {
					setCounter({ events: sumField('Eventos'), total: calculoTiempoDuracion(sumField('tot')) })
				} else if (Array.isArray(raw.Ev_breves) || Array.isArray(raw.Ev_prolon)) {
					setCounter({
						events: sumField('Ev_breves') + sumField('Ev_prolon'),
						total: calculoTiempoDuracion(sumField('tot')),
					})
				} else {
					setCounter(null)
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
					{isLoading ? (
						// La consulta abarca desde inicio de año: puede demorar varios segundos
						<span className='flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-zinc-300 bg-gray-200 dark:bg-zinc-500 px-2 py-0.5 rounded-full animate-pulse'>
							<CircularProgress size={12} color='inherit' /> Cargando…
						</span>
					) : (
						counter && (
							<span className='text-xs font-medium text-gray-600 dark:text-zinc-200 bg-gray-200 dark:bg-zinc-500 px-2 py-0.5 rounded-full'>
								{counter.events.toLocaleString('es-AR')} eventos (año en curso) · {counter.total} totales
							</span>
						)
					)}
				</div>
				<div className='flex items-center gap-3'>
					<button
						onClick={(e) => {
							e.stopPropagation()
							setOpenSummary(true)
						}}
						disabled={isLoading || !dataModal.length}
						title={
							isLoading
								? 'Cargando resumen…'
								: !dataModal.length
									? 'Sin resumen disponible para este medidor'
									: undefined
						}
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
					) : (
						<>
							{/* Filtro de fecha y hora de los antecedentes (mockup: Inicio / Fin / Filtrar) */}
							<div className='flex flex-wrap items-end gap-3 mb-3'>
								<label className='flex flex-col gap-0.5 text-xs font-semibold text-gray-600 dark:text-zinc-300'>
									Inicio
									<input
										type='datetime-local'
										value={filterStart}
										onChange={(e) => setFilterStart(e.target.value)}
										className='border border-gray-300 dark:border-zinc-500 rounded-md px-2 py-1 text-sm font-normal bg-white dark:bg-zinc-600 dark:text-zinc-100 dark:[color-scheme:dark]'
									/>
								</label>
								<label className='flex flex-col gap-0.5 text-xs font-semibold text-gray-600 dark:text-zinc-300'>
									Fin
									<input
										type='datetime-local'
										value={filterEnd}
										onChange={(e) => setFilterEnd(e.target.value)}
										className='border border-gray-300 dark:border-zinc-500 rounded-md px-2 py-1 text-sm font-normal bg-white dark:bg-zinc-600 dark:text-zinc-100 dark:[color-scheme:dark]'
									/>
								</label>
								<button
									onClick={applyFilter}
									disabled={tableLoading}
									className='text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-[7px] disabled:opacity-40 disabled:cursor-not-allowed'
								>
									Filtrar
								</button>
								{filterApplied && (
									<button
										onClick={clearFilter}
										disabled={tableLoading}
										className='text-xs font-semibold text-gray-700 dark:text-zinc-200 bg-gray-200 dark:bg-zinc-500 hover:bg-gray-300 rounded-md px-3 py-[7px] disabled:opacity-40 disabled:cursor-not-allowed'
									>
										Limpiar
									</button>
								)}
								{filterError && (
									<span className='text-xs italic text-red-600 dark:text-red-400 pb-1.5'>{filterError}</span>
								)}
							</div>
							{tableLoading ? (
								<LoaderComponent image={false} />
							) : !dataTable.length ? (
								<p className='text-center italic text-gray-500 dark:text-zinc-300 py-4'>
									{filterApplied
										? `Sin antecedentes de ${title.toLowerCase()} en el período seleccionado.`
										: `Sin antecedentes de ${title.toLowerCase()} para este medidor.`}
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
						</>
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
