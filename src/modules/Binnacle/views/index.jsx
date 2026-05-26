import { FormLabel } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import CardCustom from '../../../components/CardCustom'
import LoaderComponent from '../../../components/Loader'
import TableCustom from '../../../components/TableCustom'
import { bitacoraApi, equiposApi, personalApi } from '../api/bitacoraApi'
import BinnacleFilters from '../components/BinnacleFilters'
import BinnacleStats from '../components/BinnacleStats'
import { columnsOrdenes } from '../utils/columnTbl'
import { TIPO_EQUIPO_TO_BACKEND_TYPE } from '../utils/constants'

const mapBy = (arr, key) =>
	(arr || []).reduce((acc, item) => {
		acc[item[key]] = item
		return acc
	}, {})

// Stats del header derivadas del listado (el backend aún no expone /Binnacle/Stats).
const computeStats = (ordenes) => {
	const now = new Date()
	const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
	const hace30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
		.toISOString()
		.slice(0, 10)
	let totalMes = 0
	let enCurso = 0
	let completadasMes = 0
	let vencidas = 0
	for (const o of ordenes) {
		if (o.fechaRealizacion?.startsWith(mesActual)) totalMes++
		if (o.estado === 'curso') enCurso++
		if (o.estado === 'completada' && o.fechaRealizacion >= hace30) completadasMes++
		if (o.estado === 'vencida') vencidas++
	}
	return { totalMes, enCurso, completadasMes, vencidas, variacionCompletadas: '' }
}

const Binnacle = () => {
	const navigate = useNavigate()

	const [ordenes, setOrdenes] = useState([])
	const [equipos, setEquipos] = useState([])
	const [personal, setPersonal] = useState([])
	const [loading, setLoading] = useState(true)

	// Filtros
	const [q, setQ] = useState('')
	const [estado, setEstado] = useState('all')
	const [tipoEquipo, setTipoEquipo] = useState('')
	const [desde, setDesde] = useState('')
	const [hasta, setHasta] = useState('')

	const equiposMap = useMemo(() => mapBy(equipos, 'id'), [equipos])
	const personalMap = useMemo(() => mapBy(personal, 'id'), [personal])

	// Filtro por tipo de equipo: se aplica acá porque correlaciona
	// orden.equipoId con equiposMap[id].type (no lo resuelve el backend).
	const ordenesFiltradas = useMemo(() => {
		if (!tipoEquipo) return ordenes
		const targetType = TIPO_EQUIPO_TO_BACKEND_TYPE[tipoEquipo]
		if (targetType === undefined) return ordenes
		return ordenes.filter((o) => equiposMap[o.equipoId]?.type === targetType)
	}, [ordenes, tipoEquipo, equiposMap])

	const stats = useMemo(() => computeStats(ordenesFiltradas), [ordenesFiltradas])

	const fetchOrdenes = async () => {
		try {
			const res = await bitacoraApi.listarOrdenes({ q, estado, tipoEquipo, desde, hasta })
			setOrdenes(res)
		} catch (e) {
			console.error('Error al cargar órdenes', e)
		}
	}

	const fetchCatalogos = async () => {
		try {
			const [eq, pe] = await Promise.all([equiposApi.listar(), personalApi.listar()])
			setEquipos(eq)
			setPersonal(pe)
		} catch (e) {
			console.error('Error al cargar catálogos', e)
		}
	}

	useEffect(() => {
		const load = async () => {
			setLoading(true)
			await Promise.all([fetchCatalogos(), fetchOrdenes()])
			setLoading(false)
		}
		load()
	}, [])

	// Refetch al cambiar filtros (con un pequeño debounce sobre la búsqueda libre)
	useEffect(() => {
		const t = setTimeout(() => {
			fetchOrdenes()
		}, 250)
		return () => clearTimeout(t)
	}, [q, estado, tipoEquipo, desde, hasta])

	const handleNew = () => navigate('/Bitacora/AddOrden')
	const handleEdit = (id) => navigate(`/Bitacora/EditOrden/${id}`)

	const handleDelete = async (id) => {
		const result = await Swal.fire({
			icon: 'warning',
			title: '¿Eliminar esta orden?',
			text: 'Esta acción no se puede deshacer.',
			showCancelButton: true,
			confirmButtonText: 'Eliminar',
			cancelButtonText: 'Cancelar',
			confirmButtonColor: '#c2392b',
		})
		if (!result.isConfirmed) return
		try {
			await bitacoraApi.eliminarOrden(id)
			await fetchOrdenes()
			Swal.fire({
				icon: 'success',
				title: 'Orden eliminada',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: 'Error al eliminar',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1800,
			})
		}
	}

	const limpiarFiltros = () => {
		setQ('')
		setEstado('all')
		setTipoEquipo('')
		setDesde('')
		setHasta('')
	}

	const columns = useMemo(
		() => columnsOrdenes({ equiposMap, personalMap, onEdit: handleEdit, onDelete: handleDelete }),
		[equiposMap, personalMap],
	)

	if (loading) {
		return (
			<div className='flex flex-col w-full gap-4'>
				<LoaderComponent />
			</div>
		)
	}

	return (
		<div className='flex flex-col w-full gap-4'>
			<CardCustom className='w-full p-4 text-black rounded-md'>
				<div className='flex justify-between items-center flex-wrap gap-3'>
					<FormLabel className='!text-2xl'>Bitácora de mantenimiento</FormLabel>
					<button
						type='button'
						onClick={handleNew}
						className='bg-green-600 hover:bg-green-500 text-white rounded-md px-3 py-2 flex items-center gap-2'
					>
						<FaPlusCircle size={18} />
						Nueva orden
					</button>
				</div>
				<p className='text-sm text-gray-600 mt-1'>
					Registro de tareas, intervenciones e inspecciones sobre la red eléctrica.
				</p>
			</CardCustom>

			<BinnacleStats stats={stats} />

			<BinnacleFilters
				q={q}
				onQ={setQ}
				estado={estado}
				onEstado={setEstado}
				tipoEquipo={tipoEquipo}
				onTipoEquipo={setTipoEquipo}
				desde={desde}
				onDesde={setDesde}
				hasta={hasta}
				onHasta={setHasta}
				onClear={limpiarFiltros}
			/>

			<CardCustom className='w-full p-4 text-black rounded-md'>
				<TableCustom
					data={ordenesFiltradas}
					columns={columns}
					density='compact'
					pageSize={10}
					topToolbar
					pagination
					sort
					hide
					exportExcel
					exportPdf
				/>
			</CardCustom>
		</div>
	)
}

export default Binnacle
