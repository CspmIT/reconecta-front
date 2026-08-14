import { Chip, IconButton, Tooltip } from '@mui/material'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { ESTADOS, TIPOS_TAREA } from './constants'
import { fmtDate, fmtDuracion } from './formatters'

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

export const columnsOrdenes = ({ equiposMap, personalMap, onEdit, onDelete }) => [
	{
		header: 'N° Orden',
		accessorKey: 'id',
		size: 130,
		Cell: ({ row }) => (
			<div className='flex flex-col leading-tight'>
				<span className='font-mono font-semibold text-blue-700'>{row.original.id}</span>
				{row.original.numeroOM && (
					<span className='text-xs text-gray-500'>{row.original.numeroOM}</span>
				)}
			</div>
		),
	},
	{
		header: 'Equipo / Ubicación',
		accessorKey: 'equipoId',
		size: 220,
		exportFn: (row) => {
			const eq = equiposMap?.[row.equipoId]
			if (eq) return `${eq.nombre}${eq.tipoLabel ? ` (${eq.tipoLabel})` : ''}`
			if (row.elementoId) return `${row.equipoNombre || `Elemento ${row.elementoId}`} (Subestación)`
			return 'Sin equipo'
		},
		Cell: ({ row }) => {
			const eq = equiposMap?.[row.original.equipoId]
			if (eq) {
				return (
					<div className='flex flex-col leading-tight'>
						<span className='font-semibold'>
							{eq.nombre}
						</span>
						<span className='text-xs uppercase text-gray-500 tracking-wide'>
							{eq.tipoLabel}
						</span>
					</div>
				)
			}
			// Bitácora ligada a un Element (subestación) sin Equipment puntual.
			if (row.original.elementoId) {
				return (
					<div className='flex flex-col leading-tight'>
						<span className='font-semibold'>
							{row.original.equipoNombre || `Elemento ${row.original.elementoId}`}
						</span>
						<span className='text-xs uppercase text-gray-500 tracking-wide'>
							Subestación
						</span>
					</div>
				)
			}
			return <span className='italic text-gray-400'>Sin equipo</span>
		},
	},
	{
		header: 'Tipo de tarea',
		accessorKey: 'tipoTarea',
		size: 160,
		exportFn: (row) => labelTipo(row.tipoTarea),
		Cell: ({ row }) => (
			<Chip
				size='small'
				label={labelTipo(row.original.tipoTarea)}
				color={colorTipo[row.original.tipoTarea] || 'default'}
				variant='outlined'
			/>
		),
	},
	{
		header: 'Fecha',
		accessorKey: 'fechaRealizacion',
		size: 110,
		exportFn: (row) => fmtDate(row.fechaRealizacion),
		Cell: ({ cell }) => fmtDate(cell.getValue()),
	},
	{
		header: 'Duración',
		accessorKey: 'duracion',
		size: 100,
		enableSorting: false,
		exportFn: (row) => fmtDuracion(row.duracion),
		Cell: ({ cell }) => (
			<span className='font-mono text-sm'>{fmtDuracion(cell.getValue())}</span>
		),
	},
	{
		header: 'Personal',
		accessorKey: 'personalIds',
		size: 200,
		enableSorting: false,
		exportFn: (row) =>
			(row.personalIds || [])
				.map((id) => personalMap?.[id]?.nombre)
				.filter(Boolean)
				.join(' | '),
		Cell: ({ row }) => {
			const lista = (row.original.personalIds || [])
				.map((id) => personalMap?.[id]?.nombre)
				.filter(Boolean)
			if (lista.length === 0) return <span className='text-gray-400'>—</span>
			const shown = lista.slice(0, 2).join(', ')
			const extra = lista.length - 2
			return (
				<Tooltip title={lista.join(', ')} arrow>
					<span className='text-sm'>
						{shown}
						{extra > 0 ? ` +${extra}` : ''}
					</span>
				</Tooltip>
			)
		},
	},
	{
		header: 'Estado',
		accessorKey: 'estado',
		size: 130,
		exportFn: (row) => ESTADOS[row.estado]?.label ?? row.estado,
		Cell: ({ cell }) => {
			const est = ESTADOS[cell.getValue()] ?? { label: cell.getValue(), color: 'default' }
			return <Chip size='small' label={est.label} color={est.color} />
		},
	},
	{
		header: 'Fotos',
		id: 'cantidadFotos',
		size: 80,
		enableSorting: false,
		accessorFn: (row) =>
			(row.fotoGeneral ? 1 : 0) + (Array.isArray(row.fotosDetalle) ? row.fotosDetalle.length : 0),
		Cell: ({ cell }) => <span className='font-mono'>{cell.getValue()}</span>,
	},
	{
		header: 'Acciones',
		id: 'acciones',
		size: 130,
		enableSorting: false,
		enableColumnFilter: false,
		Cell: ({ row }) => (
			<div className='flex justify-center gap-1'>
				<Tooltip title='Ver / Editar'>
					<IconButton size='small' onClick={() => onEdit?.(row.original.id)}>
						<FaEdit className='text-blue-600' />
					</IconButton>
				</Tooltip>
				<Tooltip title='Eliminar'>
					<IconButton size='small' onClick={() => onDelete?.(row.original.id)}>
						<FaTrashAlt className='text-red-600' />
					</IconButton>
				</Tooltip>
			</div>
		),
	},
]
