import { IconButton, Tooltip, useMediaQuery } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { FaCamera, FaImage, FaTimes } from 'react-icons/fa'
import { getImage, saveImage } from '../../../utils/js/minio'

// Componente de carga de fotos para una orden de bitácora.
//
// Funciona contra Minio: las imágenes se suben con saveImage() que devuelve
// el fileName, y se recuperan con getImage() (object URL temporal). El padre
// guarda en el form el nombre del archivo (string), no el blob.
//
// Estructura del valor:
//   fotoGeneral: string | null      // fileName en Minio
//   fotosDetalle: string[]          // array de fileNames
//
// Props:
//   - fotoGeneral, fotosDetalle: nombres de archivo en Minio
//   - onChangeGeneral(name | null)
//   - onChangeDetalle(names[])
//   - max: límite de fotos detalle (default 12)

function ImageSlot({ fileName, onRemove, label }) {
	const [url, setUrl] = useState(null)

	useEffect(() => {
		let cancel = false
		const load = async () => {
			try {
				const blobUrl = await getImage(fileName)
				if (!cancel) setUrl(blobUrl)
			} catch (e) {
				if (!cancel) setUrl(null)
			}
		}
		if (fileName) load()
		return () => {
			cancel = true
		}
	}, [fileName])

	return (
		<div className='relative w-full aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center'>
			{url ? (
				<img src={url} alt={label || 'Foto'} className='w-full h-full object-cover' />
			) : (
				<FaImage className='text-gray-300' size={28} />
			)}
			{label && (
				<span className='absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded'>
					{label}
				</span>
			)}
			{onRemove && (
				<Tooltip title='Quitar'>
					<IconButton
						size='small'
						onClick={onRemove}
						className='!absolute !top-1 !right-1 !bg-black/60 hover:!bg-black/80'
					>
						<FaTimes className='text-white' size={12} />
					</IconButton>
				</Tooltip>
			)}
		</div>
	)
}

function UploadSlot({ label, hint, onPick, accept = 'image/*', capture, multiple }) {
	const ref = useRef(null)

	const handleChange = (e) => {
		const files = Array.from(e.target.files || [])
		if (files.length) onPick(files)
		e.target.value = ''
	}

	return (
		<button
			type='button'
			onClick={() => ref.current?.click()}
			className='relative w-full aspect-square rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-500 transition flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-blue-600'
		>
			{capture ? <FaCamera size={22} /> : <FaImage size={22} />}
			<span className='text-xs'>{label}</span>
			{hint && <span className='text-[10px] text-gray-400'>{hint}</span>}
			<input
				ref={ref}
				type='file'
				accept={accept}
				multiple={multiple}
				{...(capture ? { capture: 'environment' } : {})}
				onChange={handleChange}
				className='hidden'
			/>
		</button>
	)
}

export default function PhotoUploader({
	fotoGeneral = null,
	fotosDetalle = [],
	onChangeGeneral,
	onChangeDetalle,
	max = 12,
}) {
	const [uploading, setUploading] = useState(false)
	// Detecta dispositivos táctiles (móvil/tablet). En desktop el botón de
	// cámara no aporta nada (abre el mismo file picker), así que se oculta.
	const esTactil = useMediaQuery('(pointer: coarse)')

	const uploadAndSet = async (file, setter) => {
		try {
			setUploading(true)
			const name = await saveImage(file)
			setter(name)
		} catch (e) {
			console.error('Error al subir imagen', e)
		} finally {
			setUploading(false)
		}
	}

	const handleGeneralPick = async (files) => {
		const [file] = files
		if (!file) return
		await uploadAndSet(file, (name) => onChangeGeneral?.(name))
	}

	const handleDetallePick = async (files) => {
		const slotsLibres = max - fotosDetalle.length
		const aSubir = files.slice(0, slotsLibres)
		if (!aSubir.length) return
		try {
			setUploading(true)
			const nuevos = []
			for (const f of aSubir) {
				const name = await saveImage(f)
				if (name) nuevos.push(name)
			}
			onChangeDetalle?.([...fotosDetalle, ...nuevos])
		} catch (e) {
			console.error('Error al subir imágenes de detalle', e)
		} finally {
			setUploading(false)
		}
	}

	const removeDetalle = (idx) => {
		const next = fotosDetalle.filter((_, i) => i !== idx)
		onChangeDetalle?.(next)
	}

	const slotsLibres = max - fotosDetalle.length

	return (
		<div className='w-full flex flex-col gap-4'>
			{/* Foto general */}
			<div>
				<p className='text-sm font-medium mb-2'>Foto general</p>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
					{fotoGeneral ? (
						<ImageSlot
							fileName={fotoGeneral}
							label='PRINCIPAL'
							onRemove={() => onChangeGeneral?.(null)}
						/>
					) : (
						<>
							{esTactil && (
								<UploadSlot label='Tomar foto' hint='cámara' onPick={handleGeneralPick} capture />
							)}
							<UploadSlot
								label={esTactil ? 'Desde galería' : 'Subir foto'}
								hint={esTactil ? 'archivo' : 'galería / archivo'}
								onPick={handleGeneralPick}
							/>
						</>
					)}
				</div>
			</div>

			{/* Fotos detalle */}
			<div>
				<p className='text-sm font-medium mb-2'>
					Fotos detalle <span className='text-xs text-gray-500'>hasta {max}</span>
				</p>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
					{fotosDetalle.map((name, idx) => (
						<ImageSlot key={name + idx} fileName={name} onRemove={() => removeDetalle(idx)} />
					))}
					{slotsLibres > 0 && (
						<>
							{esTactil && (
								<UploadSlot label='Cámara' hint='tomar foto' onPick={handleDetallePick} capture />
							)}
							<UploadSlot
								label='Agregar'
								hint={`${slotsLibres} restantes`}
								onPick={handleDetallePick}
								multiple
							/>
						</>
					)}
				</div>
			</div>

			{uploading && <p className='text-xs text-gray-500 italic'>Subiendo imagen…</p>}
		</div>
	)
}
