import {
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	Tooltip,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { FaEdit, FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import Swal from 'sweetalert2'

import CardCustom from '../../../components/CardCustom'
import LoaderComponent from '../../../components/Loader'
import TableCustom from '../../../components/TableCustom'
import { listElementTypes, updateElementType } from '../api/elementTypeApi'

const emptyForm = { id: null, name: '', abrevs: [''] }

const ElementTypeAbm = () => {
	const [types, setTypes] = useState([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [open, setOpen] = useState(false)
	const [form, setForm] = useState(emptyForm)

	const load = async () => {
		setLoading(true)
		try {
			const data = await listElementTypes()
			setTypes(data)
		} catch (e) {
			Swal.fire({ icon: 'error', title: 'No se pudieron cargar los tipos', confirmButtonText: 'Aceptar' })
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		load()
	}, [])

	const openEdit = (row) => {
		setForm({
			id: row.id,
			name: row.name,
			abrevs: row.abrev.length > 0 ? [...row.abrev] : [''],
		})
		setOpen(true)
	}

	const closeModal = () => {
		setOpen(false)
		setForm(emptyForm)
	}

	const changeAbrev = (index, value) => {
		setForm((prev) => {
			const abrevs = [...prev.abrevs]
			abrevs[index] = value
			return { ...prev, abrevs }
		})
	}

	const addAbrevField = () => {
		setForm((prev) => ({ ...prev, abrevs: [...prev.abrevs, ''] }))
	}

	const removeAbrevField = (index) => {
		setForm((prev) => {
			const abrevs = prev.abrevs.filter((_, i) => i !== index)
			return { ...prev, abrevs: abrevs.length > 0 ? abrevs : [''] }
		})
	}

	const save = async () => {
		const name = form.name.trim()
		if (!name) return
		const abrevs = form.abrevs.map((a) => a.trim()).filter(Boolean)
		setSaving(true)
		try {
			await updateElementType({ id: form.id, name, abrevs })
			await load()
			closeModal()
			Swal.fire({
				icon: 'success',
				title: 'Se guardó correctamente',
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 1500,
			})
		} catch (e) {
			Swal.fire({
				icon: 'error',
				title: typeof e === 'string' ? e : e?.message || 'Ocurrió un problema al guardar',
				confirmButtonText: 'Aceptar',
			})
		} finally {
			setSaving(false)
		}
	}

	const columns = useMemo(
		() => [
			{ header: 'Nombre', accessorKey: 'name', size: 220 },
			{
				header: 'Abreviaturas',
				accessorKey: 'abrev',
				size: 320,
				Cell: ({ row }) => (
					<div className='flex flex-wrap gap-1'>
						{row.original.abrev.length > 0 ? (
							row.original.abrev.map((a) => <Chip key={a} label={a} size='small' />)
						) : (
							<span className='text-gray-400'>—</span>
						)}
					</div>
				),
			},
			{
				header: 'Acciones',
				accessorKey: 'id',
				size: 100,
				enableColumnFilter: false,
				enableSorting: false,
				Cell: ({ row }) => (
					<Tooltip title='Editar'>
						<IconButton size='small' color='primary' onClick={() => openEdit(row.original)}>
							<FaEdit />
						</IconButton>
					</Tooltip>
				),
			},
		],
		[]
	)

	return (
		<CardCustom className='w-full min-h-screen p-6'>
			<div className='mt-3 mb-4'>
				<p className='w-full text-center text-2xl text-black dark:text-white'>Tipos de infraestructura</p>
			</div>

			{loading ? <LoaderComponent /> : <TableCustom data={types} columns={columns} />}

			<Dialog open={open} onClose={closeModal} maxWidth='xs' fullWidth>
				<DialogTitle>Editar tipo</DialogTitle>
				<DialogContent className='!pt-2'>
					<div className='flex flex-col gap-3 mt-2'>
						<TextField
							label='Nombre *'
							value={form.name}
							onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
							autoFocus
						/>
						<div className='flex items-center justify-between mt-2'>
							<span className='text-sm text-gray-500'>Abreviaturas</span>
							<IconButton size='small' color='success' onClick={addAbrevField} title='Agregar abreviatura'>
								<FaPlusCircle />
							</IconButton>
						</div>
						{form.abrevs.map((abrev, index) => (
							<div key={index} className='flex gap-2 items-center'>
								<TextField
									className='w-full'
									size='small'
									label={`Abreviatura ${index + 1}`}
									value={abrev}
									onChange={(e) => changeAbrev(index, e.target.value)}
								/>
								<IconButton size='small' color='error' onClick={() => removeAbrevField(index)} title='Quitar'>
									<FaMinusCircle />
								</IconButton>
							</div>
						))}
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeModal} disabled={saving}>
						Cancelar
					</Button>
					<Button onClick={save} variant='contained' color='success' disabled={saving || !form.name.trim()}>
						{saving ? 'Guardando…' : 'Guardar'}
					</Button>
				</DialogActions>
			</Dialog>
		</CardCustom>
	)
}

export default ElementTypeAbm
