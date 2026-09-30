import { useEffect, useState } from 'react'
import { MdDownload, MdVisibility, MdVisibilityOff } from 'react-icons/md'

import CardCustom from '../../../components/CardCustom'
import LoaderComponent from '../../../components/Loader'
import { EXTERNAL_BASE, externalApi } from '../api/externalApi'
import { Markdown } from '../utils/openapi'
import { CopyButton, errorText, inputClass, pillClass } from '../utils/shared'
import EndpointCard from './EndpointCard'

/*
 * Documentación de la API armada con la especificación OpenAPI del backend: la
 * lista de métodos sale de ahí, así que un endpoint nuevo aparece acá sin tocar
 * el front.
 *
 * El token de prueba vive solo en el estado del componente: no se guarda en
 * ningún lado y se pierde al salir de la pestaña.
 */
const DocsTab = () => {
	const [spec, setSpec] = useState(null)
	const [error, setError] = useState('')
	const [token, setToken] = useState('')
	const [showToken, setShowToken] = useState(false)

	useEffect(() => {
		externalApi
			.getSpec()
			.then(setSpec)
			.catch((e) => setError(errorText(e)))
	}, [])

	const download = () => {
		// La descarga lleva la URL absoluta del servidor, para importarla tal cual
		// en Postman o Insomnia
		const blob = new Blob([JSON.stringify({ ...spec, servers: [{ url: EXTERNAL_BASE }] }, null, 2)], {
			type: 'application/json',
		})
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = 'reconecta-api-externa.openapi.json'
		link.click()
		URL.revokeObjectURL(url)
	}

	if (error) return <p className='py-6 text-center text-xs text-slate-400 dark:text-gray-400'>{error}</p>
	if (!spec) return <LoaderComponent image={false} />

	// Métodos agrupados por la etiqueta de la especificación, en el orden de `tags`
	const operations = Object.entries(spec.paths || {}).flatMap(([path, methods]) =>
		Object.values(methods).map((operation) => ({ path, operation }))
	)
	const groups = (spec.tags || [])
		.map((tag) => ({ ...tag, items: operations.filter((op) => op.operation.tags?.includes(tag.name)) }))
		.filter((group) => group.items.length)

	return (
		<div className='flex flex-col gap-3'>
			<CardCustom className='rounded-xl p-4 flex flex-col gap-3'>
				<div className='flex flex-wrap items-start justify-between gap-3'>
					<div>
						<h3 className='text-sm font-semibold text-slate-700 dark:text-gray-200'>{spec.info?.title}</h3>
						<span className='text-xs text-slate-400'>versión {spec.info?.version}</span>
					</div>
					<button type='button' className={`${pillClass(false)} inline-flex items-center gap-1`} onClick={download}>
						<MdDownload /> OpenAPI (Postman / Insomnia)
					</button>
				</div>

				<div className='flex flex-wrap items-center gap-2'>
					<span className='text-xs font-semibold uppercase tracking-wide text-slate-400'>URL base</span>
					<code className='rounded bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-zinc-800 dark:text-slate-200'>
						{EXTERNAL_BASE}
					</code>
					<CopyButton text={EXTERNAL_BASE} />
				</div>

				<Markdown text={spec.info?.description} />
			</CardCustom>

			<CardCustom className='rounded-xl p-4 flex flex-col gap-2'>
				<h3 className='text-sm font-semibold text-slate-700 dark:text-gray-200'>Token para probar</h3>
				<p className='text-xs text-slate-500 dark:text-gray-400'>
					Pegá un token para ejecutar los métodos desde acá. No se guarda: al salir de la pestaña se descarta.
				</p>
				<div className='flex items-center gap-2'>
					<input
						type={showToken ? 'text' : 'password'}
						className={`${inputClass} flex-1 font-mono`}
						placeholder='rk.<cooperativa>.<secreto>'
						autoComplete='off'
						value={token}
						onChange={(e) => setToken(e.target.value.trim())}
					/>
					<button
						type='button'
						className={pillClass(false)}
						onClick={() => setShowToken((v) => !v)}
						title={showToken ? 'Ocultar' : 'Mostrar'}
					>
						{showToken ? <MdVisibilityOff /> : <MdVisibility />}
					</button>
				</div>
			</CardCustom>

			{groups.map((group) => (
				<CardCustom key={group.name} className='rounded-xl p-4 flex flex-col gap-3'>
					<div>
						<h3 className='text-sm font-semibold text-slate-700 dark:text-gray-200'>{group.name}</h3>
						{group.description && <Markdown text={group.description} className='!text-xs' />}
					</div>
					{group.items.map(({ path, operation }) => (
						<EndpointCard key={path} spec={spec} path={path} operation={operation} token={token} />
					))}
				</CardCustom>
			))}
		</div>
	)
}

export default DocsTab
