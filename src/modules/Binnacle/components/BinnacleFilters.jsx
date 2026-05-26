import { MenuItem, TextField, Button } from '@mui/material'
import CardCustom from '../../../components/CardCustom'
import { ESTADOS_FILTRO, TIPOS_EQUIPO } from '../utils/constants'

// Barra de filtros del listado: búsqueda, estado, tipo de equipo y rango de fechas.
export default function BinnacleFilters({
	q,
	onQ,
	estado,
	onEstado,
	tipoEquipo,
	onTipoEquipo,
	desde,
	onDesde,
	hasta,
	onHasta,
	onClear,
}) {
	return (
		<CardCustom className='w-full p-4 text-black rounded-md'>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center'>
				<TextField
					size='small'
					label='Buscar'
					placeholder='Orden, equipo, descripción o personal…'
					value={q}
					onChange={(e) => onQ(e.target.value)}
					className='md:col-span-3'
				/>
				<TextField
					select
					size='small'
					label='Estado'
					value={estado}
					onChange={(e) => onEstado(e.target.value)}
					className='md:col-span-2'
				>
					{ESTADOS_FILTRO.map((o) => (
						<MenuItem key={o.value} value={o.value}>
							{o.label}
						</MenuItem>
					))}
				</TextField>
				<TextField
					select
					size='small'
					label='Tipo de equipo'
					value={tipoEquipo}
					onChange={(e) => onTipoEquipo(e.target.value)}
					className='md:col-span-3'
				>
					{TIPOS_EQUIPO.map((o) => (
						<MenuItem key={o.value || 'all'} value={o.value}>
							{o.label}
						</MenuItem>
					))}
				</TextField>
				<TextField
					size='small'
					type='date'
					label='Desde'
					InputLabelProps={{ shrink: true }}
					value={desde}
					onChange={(e) => onDesde(e.target.value)}
					className='md:col-span-2'
				/>
				<TextField
					size='small'
					type='date'
					label='Hasta'
					InputLabelProps={{ shrink: true }}
					value={hasta}
					onChange={(e) => onHasta(e.target.value)}
					className='md:col-span-2'
				/>
				<div className='md:col-span-12 flex justify-end'>
					<Button variant='text' size='small' onClick={onClear}>
						Limpiar filtros
					</Button>
				</div>
			</div>
		</CardCustom>
	)
}
