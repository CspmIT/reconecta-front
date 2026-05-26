import {
	Autocomplete,
	Chip,
	FormLabel,
	MenuItem,
	TextField,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaSave, FaTrashAlt } from 'react-icons/fa'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'

import CardCustom from '../../../components/CardCustom'
import LoaderComponent from '../../../components/Loader'
import { bitacoraApi, equiposApi, personalApi } from '../api/bitacoraApi'
import PhotoUploader from '../components/PhotoUploader'
import { ESTADOS, TIPOS_TAREA } from '../utils/constants'

const ordenInicial = {
	numeroOM: '',
	equipoId: '',
	elementoId: '',
	equipoNombre: '',
	tipoTarea: '',
	descripcion: '',
	fechaRealizacion: new Date().toISOString().slice(0, 10),
	dias: 0,
	horas: 2,
	minutos: 30,
	personalIds: [],
	estado: 'curso',
}

const AddOrden = () => {
	const navigate = useNavigate()
	const { ordenId } = useParams()
	const [searchParams] = useSearchParams()
	const isEdit = Boolean(ordenId)
	// Lock por Equipment (reconectador/medidor/etc.) o por Element (subestación rural).
	const equipoPreseleccionado = !isEdit && searchParams.get('equipoId')
		? Number(searchParams.get('equipoId'))
		: null
	const elementoPreseleccionado = !isEdit && searchParams.get('elementoId')
		? Number(searchParams.get('elementoId'))
		: null
	const elementoNombrePreseleccionado = searchParams.get('elementoNombre') || ''
	const equipoLocked = equipoPreseleccionado !== null
	const elementoLocked = elementoPreseleccionado !== null

	const {
		control,
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			...ordenInicial,
			equipoId: equipoPreseleccionado ?? '',
			elementoId: elementoPreseleccionado ?? '',
			equipoNombre: elementoNombrePreseleccionado,
		},
	})

	const [equipos, setEquipos] = useState([])
	const [personal, setPersonal] = useState([])
	const [loading, setLoading] = useState(true)

	const [fotoGeneral, setFotoGeneral] = useState(null)
	const [fotosDetalle, setFotosDetalle] = useState([])

	const equipoSeleccionado = watch('equipoId')
	const elementoIdActual = watch('elementoId')
	const equipoNombreActual = watch('equipoNombre')
	// El form trabaja en uno de dos modos según qué FK tiene la orden:
	//  - modoElemento: bitácora atada a un Element/subestación (id_element)
	//  - modoEquipo:   bitácora atada a un Equipment (id_equipment) → autocomplete
	const modoElemento = Boolean(elementoIdActual)
	const equipoData = useMemo(
		() => equipos.find((e) => e.id === equipoSeleccionado),
		[equipos, equipoSeleccionado],
	)

	useEffect(() => {
		const cargar = async () => {
			try {
				const [eq, pe] = await Promise.all([
					equiposApi.listar(),
					personalApi.listar(),
				])
				setEquipos(eq)
				setPersonal(pe)

				if (isEdit) {
					const orden = await bitacoraApi.obtenerOrden(ordenId)
					reset({
						numeroOM: orden.numeroOM || '',
						equipoId: orden.equipoId || '',
						elementoId: orden.elementoId || '',
						equipoNombre: orden.equipoNombre || '',
						tipoTarea: orden.tipoTarea || '',
						descripcion: orden.descripcion || '',
						fechaRealizacion:
							orden.fechaRealizacion || new Date().toISOString().slice(0, 10),
						dias: orden.duracion?.dias ?? 0,
						horas: orden.duracion?.horas ?? 0,
						minutos: orden.duracion?.minutos ?? 0,
						personalIds: orden.personalIds || [],
						estado: orden.estado || 'curso',
					})
					setFotoGeneral(orden.fotoGeneral || null)
					setFotosDetalle(orden.fotosDetalle || [])
				}
			} catch (e) {
				console.error('Error al cargar datos', e)
				Swal.fire({
					icon: 'error',
					title: 'No se pudieron cargar los datos',
					toast: true,
					position: 'top-end',
					showConfirmButton: false,
					timer: 1800,
				})
			} finally {
				setLoading(false)
			}
		}
		cargar()
	}, [ordenId])

	const onSubmit = async (data) => {
		// El form maneja shape UI; bitacoraApi.{crear,actualizar}Orden mapea a backend.
		// Polimorfismo: id_equipment (Equipment) ó id_element (Element/subestación), excluyentes.
		const esModoElemento = Boolean(data.elementoId)
		const orden = {
			numeroOM: data.numeroOM,
			equipoId: esModoElemento ? null : data.equipoId,
			elementoId: esModoElemento ? data.elementoId : null,
			equipoNombre: esModoElemento
				? data.equipoNombre
				: equipoData?.nombre ?? null,
			tipoTarea: data.tipoTarea,
			descripcion: data.descripcion,
			fechaRealizacion: data.fechaRealizacion,
			duracion: {
				dias: data.dias,
				horas: data.horas,
				minutos: data.minutos,
			},
			personalIds: data.personalIds || [],
			estado: data.estado,
			fotoGeneral,
			fotosDetalle,
		}
		try {
			if (isEdit) await bitacoraApi.actualizarOrden(ordenId, orden)
			else await bitacoraApi.crearOrden(orden)
			Swal.fire({
				icon: 'success',
				title: isEdit ? 'Orden actualizada' : 'Orden creada',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
			navigate('/bitacora')
		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: 'Error al guardar la orden',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1800,
			})
		}
	}

	const onEliminar = async () => {
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
			await bitacoraApi.eliminarOrden(ordenId)
			Swal.fire({
				icon: 'success',
				title: 'Orden eliminada',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
			navigate('/bitacora')
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

	if (loading) {
		return (
			<div className='w-full flex justify-center text-black'>
				<LoaderComponent />
			</div>
		)
	}

	return (
		<div className='w-full flex justify-center text-black'>
			<CardCustom className='w-full rounded-md p-6 flex flex-col gap-4'>
				<div className='flex justify-between items-center flex-wrap gap-2'>
					<FormLabel className='!text-2xl'>
						{isEdit ? 'Editar orden de trabajo' : 'Nueva orden de trabajo'}
					</FormLabel>
					{isEdit && (
						<button
							type='button'
							onClick={onEliminar}
							className='bg-red-600 hover:bg-red-500 text-white rounded-md px-3 py-2 flex items-center gap-2 text-sm'
						>
							<FaTrashAlt /> Eliminar
						</button>
					)}
				</div>

				<form
					id='formOrdenBinnacle'
					onSubmit={handleSubmit(onSubmit)}
					className='w-full flex flex-col gap-6'
				>
					{/* === Equipo y tarea === */}
					<section className='flex flex-col gap-3'>
						<p className='text-lg font-medium'>Equipo y tarea</p>
						<div className='flex flex-wrap gap-3'>
							{modoElemento ? (
								<TextField
									disabled
									className='w-full md:w-1/2'
									label='Equipo / Ubicación'
									value={equipoNombreActual || ''}
									helperText='Mantenimiento atado a una subestación (preseleccionado)'
								/>
							) : (
								<Controller
									name='equipoId'
									control={control}
									render={({ field }) => (
										<Autocomplete
											options={equipos}
											value={equipos.find((e) => e.id === field.value) || null}
											onChange={(_, v) => field.onChange(v?.id || '')}
											getOptionLabel={(e) => `${e.nombre}`}
											groupBy={(e) => e.tipoLabel}
											isOptionEqualToValue={(o, v) => o.id === v.id}
											disabled={equipoLocked}
											className='w-full md:w-1/2'
											renderInput={(params) => (
												<TextField
													{...params}
													label='Equipo vinculado'
													helperText={
														equipoLocked
															? 'Equipo preseleccionado desde su detalle'
															: 'Opcional · dejar vacío si la tarea no está asociada a un equipo'
													}
												/>
											)}
										/>
									)}
								/>
							)}
							<TextField
								select
								className='w-full md:w-[calc(25%-12px)]'
								label='Tipo de tarea *'
								value={watch('tipoTarea') || ''}
								{...register('tipoTarea', { required: 'Tipo obligatorio' })}
								error={!!errors.tipoTarea}
								helperText={errors.tipoTarea?.message}
								onChange={(e) => setValue('tipoTarea', e.target.value)}
							>
								{TIPOS_TAREA.map((t) => (
									<MenuItem key={t.value} value={t.value}>
										{t.label}
									</MenuItem>
								))}
							</TextField>
							<TextField
								className='w-full md:w-[calc(25%-12px)]'
								label='N° Orden de Mantenimiento'
								placeholder='Opcional'
								{...register('numeroOM')}
								InputLabelProps={{ shrink: true }}
							/>
						</div>
						{equipoData && (
							<p className='text-xs text-gray-500'>
								<b>{equipoData.tipoLabel}</b> · {equipoData.ubicacion}
							</p>
						)}
					</section>
					{/* === Cuándo y cuánto === */}
					<section className='flex flex-col gap-3'>
						<p className='text-lg font-medium'>Cuándo y cuánto duró</p>
						<div className='flex flex-wrap gap-3'>
							<TextField
								type='date'
								label='Fecha de realización *'
								className='w-full md:w-1/4'
								InputLabelProps={{ shrink: true }}
								{...register('fechaRealizacion', { required: 'Fecha obligatoria' })}
								error={!!errors.fechaRealizacion}
								helperText={errors.fechaRealizacion?.message}
							/>
							<TextField
								select
								label='Estado *'
								className='w-full md:w-1/4'
								value={watch('estado') || 'curso'}
								{...register('estado', { required: true })}
								onChange={(e) => setValue('estado', e.target.value)}
							>
								{Object.entries(ESTADOS).map(([v, e]) => (
									<MenuItem key={v} value={v}>
										{e.label}
									</MenuItem>
								))}
							</TextField>
							<TextField
								type='number'
								label='Días'
								className='w-20'
								inputProps={{ min: 0 }}
								{...register('dias')}
							/>
							<TextField
								type='number'
								label='Horas'
								className='w-20'
								inputProps={{ min: 0, max: 23 }}
								{...register('horas')}
							/>
							<TextField
								type='number'
								label='Minutos'
								className='w-24'
								inputProps={{ min: 0, max: 59, step: 5 }}
								{...register('minutos', { required: 'Minutos obligatorios' })}
								error={!!errors.minutos}
								helperText={errors.minutos?.message}
							/>
						</div>
					</section>

					{/* === Personal === */}
					<section className='flex flex-col gap-3'>
						<p className='text-lg font-medium'>Personal</p>
						<Controller
							name='personalIds'
							control={control}
							rules={{ validate: (v) => (v?.length ? true : 'Asignar al menos una persona') }}
							render={({ field }) => (
								<Autocomplete
									multiple
									options={personal}
									value={personal.filter((p) => field.value?.includes(p.id))}
									onChange={(_, v) => field.onChange(v.map((p) => p.id))}
									getOptionLabel={(p) => (p.nombre)}
									isOptionEqualToValue={(o, v) => o.id === v.id}
									renderTags={(value, getTagProps) =>
										value.map((option, index) => (
											<Chip
												label={option.nombre}
												size='small'
												{...getTagProps({ index })}
												key={option.id}
											/>
										))
									}
									renderInput={(params) => (
										<TextField
											{...params}
											label='Personal abocado *'
											error={!!errors.personalIds}
											helperText={errors.personalIds?.message}
										/>
									)}
								/>
							)}
						/>
					</section>

					{/* === Descripción === */}
					<section className='flex flex-col gap-3'>
						<p className='text-lg font-medium'>Tarea realizada</p>
						<TextField
							multiline
							minRows={4}
							label='Descripción *'
							placeholder='Detallar la tarea: pasos ejecutados, observaciones, materiales utilizados, recomendaciones…'
							{...register('descripcion', { required: 'Descripción obligatoria' })}
							error={!!errors.descripcion}
							helperText={errors.descripcion?.message}
						/>
					</section>

					{/* === Fotos === */}
					<section className='flex flex-col gap-3'>
						<p className='text-lg font-medium'>Documentación fotográfica</p>
						<PhotoUploader
							fotoGeneral={fotoGeneral}
							fotosDetalle={fotosDetalle}
							onChangeGeneral={setFotoGeneral}
							onChangeDetalle={setFotosDetalle}
						/>
					</section>

					{/* === Acciones === */}
					<div className='flex justify-end gap-2 mt-2'>
						<button
							type='button'
							onClick={() => navigate('/bitacora')}
							className='bg-gray-300 hover:bg-gray-400 text-black rounded-md px-4 py-2 text-sm'
						>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={isSubmitting}
							className='bg-green-600 hover:bg-green-500 text-white rounded-md px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-60'
						>
							<FaSave /> {isSubmitting ? 'Guardando…' : 'Guardar orden'}
						</button>
					</div>
				</form>
			</CardCustom>
		</div>
	)
}

export default AddOrden
