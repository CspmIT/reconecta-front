import { Button, Chip, IconButton, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { FaEye, FaPlusCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import LoaderComponent from '../../../components/Loader'
import TableCustom from '../../../components/TableCustom'
import { bitacoraApi } from '../api/bitacoraApi'
import { ESTADOS, TIPOS_TAREA } from '../utils/constants'
import { fmtDate, fmtDuracion } from '../utils/formatters'

const colorTipo = {
	preventivo: 'success',
	correctivo: 'error',
	inspeccion: 'info',
	instalacion: 'secondary',
	cambio: 'warning',
	reparacion: 'warning',
	otro: 'default',
}

const labelTipo = (val) => TIPOS_TAREA.find((t) => t.value === val)?.label ?? val

const columnsMantenimiento = (onVer) => [
	{
		header: 'N° Orden',
		accessorKey: 'id',
		size: 110,
		Cell: ({ row }) => (
			<div className='flex flex-col leading-tight'>
				<span className='font-mono font-semibold text-blue-700'>
					{row.original.id}
				</span>
				{row.original.numeroOM && (
					<span className='text-xs text-gray-500'>{row.original.numeroOM}</span>
				)}
			</div>
		),
	},
	{
		header: 'Fecha',
		accessorKey: 'fechaRealizacion',
		size: 110,
		Cell: ({ cell }) => fmtDate(cell.getValue()),
	},
	{
		header: 'Tipo de tarea',
		accessorKey: 'tipoTarea',
		size: 170,
		Cell: ({ cell }) => (
			<Chip
				size='small'
				label={labelTipo(cell.getValue())}
				color={colorTipo[cell.getValue()] || 'default'}
				variant='outlined'
			/>
		),
	},
	{
		header: 'Estado',
		accessorKey: 'estado',
		size: 130,
		Cell: ({ cell }) => {
			const est = ESTADOS[cell.getValue()] ?? {
				label: cell.getValue(),
				color: 'default',
			}
			return <Chip size='small' label={est.label} color={est.color} />
		},
	},
	{
		header: 'Duración',
		accessorKey: 'duracion',
		size: 110,
		enableSorting: false,
		Cell: ({ cell }) => (
			<span className='font-mono text-sm'>{fmtDuracion(cell.getValue())}</span>
		),
	},
	{
		header: 'Descripción',
		accessorKey: 'descripcion',
		Cell: ({ cell }) => (
			<Tooltip title={cell.getValue() || ''} arrow>
				<span className='text-sm line-clamp-2'>{cell.getValue() || '—'}</span>
			</Tooltip>
		),
	},
	{
		header: 'Acción',
		id: 'acciones',
		size: 80,
		enableSorting: false,
		enableColumnFilter: false,
		Cell: ({ row }) => (
			<Tooltip title='Ver / Editar'>
				<IconButton size='small' onClick={() => onVer?.(row.original.id)}>
					<FaEye className='text-blue-600' />
				</IconButton>
			</Tooltip>
		),
	},
]

// Recibe uno (excluyente):
//   - idEquipment: cuando el contexto es un Equipment (reconectador, medidor, etc.)
//   - idElement + elementoNombre: cuando el contexto es un Element sin Equipment (subestación)
const MaintenanceBoard = ({ idEquipment = null, idElement = null, elementoNombre = '' }) => {
	const navigate = useNavigate()
	const [ordenes, setOrdenes] = useState(null)

	useEffect(() => {
		const load = async () => {
			setOrdenes(null)
			try {
				const data = idEquipment
					? await bitacoraApi.listarOrdenesPorEquipment(idEquipment)
					: await bitacoraApi.listarOrdenesPorElement(idElement)
				setOrdenes(data)
			} catch (e) {
				console.error('Error al cargar mantenimientos', e)
				setOrdenes([])
			}
		}
		if (idEquipment || idElement) load()
		else setOrdenes([])
	}, [idEquipment, idElement])

	const handleVer = (id) => navigate(`/Bitacora/EditOrden/${id}`)
	const handleNuevo = () => {
		const params = new URLSearchParams()
		if (idEquipment) params.set('equipoId', idEquipment)
		else if (idElement) {
			params.set('elementoId', idElement)
			if (elementoNombre) params.set('elementoNombre', elementoNombre)
		}
		const qs = params.toString()
		navigate(`/Bitacora/AddOrden${qs ? `?${qs}` : ''}`)
	}

	return (
		<div className='w-full text-black dark:text-white'>
			<div className='w-full flex justify-end mb-3'>
				<Button
					variant='contained'
					color='success'
					size='small'
					onClick={handleNuevo}
					disabled={!idEquipment && !idElement}
					startIcon={<FaPlusCircle />}
				>
					Nuevo mantenimiento
				</Button>
			</div>

			{ordenes === null ? (
				<div className='w-full flex justify-center py-6'>
					<LoaderComponent />
				</div>
			) : ordenes.length === 0 ? (
				<div className='w-full flex justify-center py-10 text-gray-500 italic'>
					No hay mantenimientos registrados para este equipo.
				</div>
			) : (
				<TableCustom
					data={ordenes}
					columns={columnsMantenimiento(handleVer)}
					density='compact'
					pageSize={10}
					topToolbar
					pagination
					sort
					hide
				/>
			)}
		</div>
	)
}

export default MaintenanceBoard
