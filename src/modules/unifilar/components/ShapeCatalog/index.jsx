import { useMemo, useState } from 'react'
import {
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	Select,
} from '@mui/material'
import EntityRenderer from '../Editor/EntityRenderer'
import { unionBBox } from '../../utils/js/geometry'
import { KINDS } from '../SidePanel'

// Catálogo de formas del plano importado.
//
// El DWG del unifilar no trae bloques: llega como geometría explotada, sin
// tipos. Pero se dibuja copiando y pegando la misma celda, así que la
// importación agrupa los trazos en símbolos y los símbolos en "formas" (una
// forma = todas sus copias, incluidas las espejadas y rotadas).
//
// Acá el usuario tipifica cada forma UNA vez y el tipo se propaga a todas sus
// instancias: en E.T. Morteros son 15 formas para 75 símbolos.

// Miniatura del símbolo de muestra de la forma
const Preview = ({ entities }) => {
	const box = unionBBox(entities)
	if (!box) return null
	const w = box[2] - box[0]
	const h = box[3] - box[1]
	const pad = Math.max(w, h) * 0.12
	return (
		<svg
			viewBox={[box[0] - pad, box[1] - pad, w + pad * 2, h + pad * 2].join(' ')}
			width='56'
			height='56'
			className='shrink-0 text-gray-900 dark:text-gray-200'
			fill='none'
			stroke='currentColor'
			strokeWidth={Math.max(w, h) / 26}
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			{entities.map((e) => (
				<EntityRenderer key={e.id} entity={e} bare />
			))}
		</svg>
	)
}

const ShapeCatalog = ({ open, document, shapeTypes = {}, onSave, onClose }) => {
	const [draft, setDraft] = useState(shapeTypes)
	const [saving, setSaving] = useState(false)

	const byId = useMemo(() => new Map(document.entities.map((e) => [e.id, e])), [document.entities])
	const symbolById = useMemo(
		() => new Map((document.symbols || []).map((s) => [s.id, s])),
		[document.symbols]
	)
	const shapes = document.shapes || []

	// Al reabrir el diálogo se vuelve a partir de lo guardado
	const [openedWith, setOpenedWith] = useState(shapeTypes)
	if (open && openedWith !== shapeTypes) {
		setOpenedWith(shapeTypes)
		setDraft(shapeTypes)
	}

	const typed = shapes.filter((s) => draft[s.key]).length
	const instances = shapes.reduce((total, s) => total + (draft[s.key] ? s.count : 0), 0)
	const totalInstances = shapes.reduce((total, s) => total + s.count, 0)

	const save = async () => {
		setSaving(true)
		try {
			await onSave(draft)
		} finally {
			setSaving(false)
		}
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
			<DialogTitle>
				Tipificar símbolos del plano
				<p className='text-sm font-normal text-gray-500 dark:text-gray-400 mt-1'>
					El plano repite las mismas formas. Asigná el tipo una vez por forma y se aplica a todas sus
					copias.
				</p>
			</DialogTitle>
			<DialogContent dividers>
				{shapes.length === 0 ? (
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Este plano se importó antes de la detección de símbolos. Reprocesalo para generar el
						catálogo.
					</p>
				) : (
					<div className='flex flex-col gap-2'>
						{shapes.map((shape) => {
							const sample = symbolById.get(shape.sample)
							const entities = (sample?.entities || []).map((id) => byId.get(id)).filter(Boolean)
							return (
								<div
									key={shape.key}
									className='flex items-center gap-3 border border-gray-300 dark:border-gray-700 rounded-md p-2'
								>
									<Preview entities={entities} />
									<div className='flex-1 min-w-0'>
										<div className='flex items-center gap-2 flex-wrap'>
											<Chip size='small' label={`${shape.count} ${shape.count === 1 ? 'copia' : 'copias'}`} />
											<span className='text-xs text-gray-500 dark:text-gray-400'>
												{shape.strokes} trazos
											</span>
										</div>
										{shape.labels?.length > 0 && (
											<p className='text-xs text-gray-500 dark:text-gray-400 truncate mt-1'>
												Rótulos cerca: {shape.labels.join(' · ')}
											</p>
										)}
									</div>
									<Select
										size='small'
										displayEmpty
										className='min-w-52'
										value={draft[shape.key] || ''}
										onChange={(event) =>
											setDraft((current) => {
												const next = { ...current }
												if (event.target.value) next[shape.key] = event.target.value
												else delete next[shape.key]
												return next
											})
										}
									>
										<MenuItem value=''>
											<em>Sin tipificar</em>
										</MenuItem>
										{Object.entries(KINDS).map(([key, label]) => (
											<MenuItem key={key} value={key}>
												{label}
											</MenuItem>
										))}
									</Select>
								</div>
							)
						})}
					</div>
				)}
			</DialogContent>
			<DialogActions>
				<span className='text-sm text-gray-500 dark:text-gray-400 mr-auto ml-2'>
					{typed} de {shapes.length} formas · {instances} de {totalInstances} símbolos tipificados
				</span>
				<Button onClick={onClose}>Cancelar</Button>
				<Button variant='contained' disabled={saving || shapes.length === 0} onClick={save}>
					Guardar
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ShapeCatalog
