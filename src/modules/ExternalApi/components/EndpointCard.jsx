import { CircularProgress } from '@mui/material'
import { useMemo, useState } from 'react'
import { MdExpandMore } from 'react-icons/md'

import { EXTERNAL_BASE, externalApi } from '../api/externalApi'
import { Markdown, buildPath, curlFor, exampleFrom, paramType } from '../utils/openapi'
import { CodeBlock, inputClass, pillClass } from '../utils/shared'

const statusClass = (status) =>
	status >= 200 && status < 300
		? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
		: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'

/*
 * Un método de la API: descripción, parámetros, respuestas, ejemplo y prueba en
 * vivo con el token que el usuario pegó arriba.
 */
const EndpointCard = ({ spec, path, operation, token }) => {
	const [open, setOpen] = useState(false)
	const [values, setValues] = useState({})
	const [running, setRunning] = useState(false)
	const [result, setResult] = useState(null)

	const parameters = operation.parameters || []
	const concretePath = buildPath(path, parameters, values)
	const missingPath = parameters.some((p) => p.in === 'path' && !values[p.name])

	const example = useMemo(() => {
		const schema = operation.responses?.['200']?.content?.['application/json']?.schema
		return schema ? JSON.stringify(exampleFrom(spec, schema), null, 2) : null
	}, [spec, operation])

	const run = async () => {
		setRunning(true)
		setResult(await externalApi.tryRequest(concretePath, token))
		setRunning(false)
	}

	return (
		<div className='rounded-xl border border-slate-200 dark:border-gray-700'>
			<button
				type='button'
				className='flex w-full items-center gap-3 px-4 py-3 text-left'
				onClick={() => setOpen((v) => !v)}
			>
				<span className='rounded bg-sky-100 px-2 py-0.5 font-mono text-xs font-bold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'>
					GET
				</span>
				<code className='text-sm font-semibold text-slate-800 dark:text-gray-100'>{path}</code>
				<span className='hidden text-sm text-slate-500 dark:text-gray-400 sm:inline'>{operation.summary}</span>
				<MdExpandMore className={`ml-auto shrink-0 text-xl text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
			</button>

			{open && (
				<div className='flex flex-col gap-4 border-t border-slate-200 px-4 py-4 dark:border-gray-700'>
					<p className='text-sm font-semibold text-slate-700 dark:text-gray-200 sm:hidden'>{operation.summary}</p>
					{operation.description && <Markdown text={operation.description} />}

					{parameters.length > 0 && (
						<div className='flex flex-col gap-2'>
							<h4 className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Parámetros</h4>
							<div className='overflow-x-auto'>
								<table className='w-full text-left text-sm'>
									<thead className='text-xs text-slate-400'>
										<tr>
											<th className='py-1 pr-3 font-medium'>Nombre</th>
											<th className='py-1 pr-3 font-medium'>En</th>
											<th className='py-1 pr-3 font-medium'>Tipo</th>
											<th className='py-1 pr-3 font-medium'>Descripción</th>
											<th className='py-1 font-medium'>Valor de prueba</th>
										</tr>
									</thead>
									<tbody className='text-slate-600 dark:text-gray-300'>
										{parameters.map((param) => (
											<tr key={param.name} className='border-t border-slate-100 align-top dark:border-gray-700'>
												<td className='py-2 pr-3'>
													<code className='font-semibold'>{param.name}</code>
													{param.required && <span className='ml-1 text-red-500'>*</span>}
												</td>
												<td className='py-2 pr-3 text-xs'>{param.in}</td>
												<td className='py-2 pr-3 font-mono text-xs'>
													{paramType(param.schema)}
													{param.schema?.default !== undefined && (
														<div className='text-slate-400'>por defecto: {String(param.schema.default)}</div>
													)}
												</td>
												<td className='py-2 pr-3 text-xs'>{param.description ? <Markdown text={param.description} className='!text-xs' /> : '—'}</td>
												<td className='py-2'>
													{param.schema?.enum ? (
														<select
															className={`${inputClass} !py-1 !text-xs`}
															value={values[param.name] || ''}
															onChange={(e) => setValues((prev) => ({ ...prev, [param.name]: e.target.value }))}
														>
															<option value=''>—</option>
															{param.schema.enum.map((opt) => (
																<option key={opt} value={opt}>
																	{opt}
																</option>
															))}
														</select>
													) : (
														<input
															className={`${inputClass} !py-1 !text-xs w-44`}
															placeholder={param.schema?.example ?? (param.schema?.format === 'date-time' ? '2026-09-01T00:00:00Z' : '')}
															value={values[param.name] || ''}
															onChange={(e) => setValues((prev) => ({ ...prev, [param.name]: e.target.value }))}
														/>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					<div className='flex flex-col gap-2'>
						<h4 className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Respuestas</h4>
						<ul className='flex flex-col gap-1 text-sm text-slate-600 dark:text-gray-300'>
							{Object.entries(operation.responses || {}).map(([code, response]) => (
								<li key={code} className='flex gap-2'>
									<span className={`rounded px-1.5 font-mono text-xs font-semibold ${statusClass(Number(code))}`}>{code}</span>
									<span>{response.description}</span>
								</li>
							))}
						</ul>
					</div>

					{example && (
						<div className='flex flex-col gap-2'>
							<h4 className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Ejemplo de respuesta</h4>
							<CodeBlock code={example} maxHeight={260} />
						</div>
					)}

					<div className='flex flex-col gap-2'>
						<h4 className='text-xs font-semibold uppercase tracking-wide text-slate-400'>Probar</h4>
						<CodeBlock code={curlFor(EXTERNAL_BASE, concretePath, token)} />
						<div className='flex flex-wrap items-center gap-2'>
							<button
								type='button'
								className={`${pillClass(true)} inline-flex items-center gap-2`}
								disabled={!token || missingPath || running}
								onClick={run}
							>
								{running && <CircularProgress size={12} color='inherit' />}
								Enviar
							</button>
							{!token && <span className='text-xs text-slate-400'>Pegá un token arriba para probar.</span>}
							{token && missingPath && <span className='text-xs text-slate-400'>Completá los parámetros de path.</span>}
							{result && (
								<span className='text-xs text-slate-500 dark:text-gray-400'>
									<span className={`mr-2 rounded px-1.5 py-0.5 font-mono font-semibold ${statusClass(result.status)}`}>
										{result.status || 'sin respuesta'}
									</span>
									{result.ms} ms
								</span>
							)}
						</div>
						{result && <CodeBlock code={JSON.stringify(result.data, null, 2)} maxHeight={400} />}
					</div>
				</div>
			)}
		</div>
	)
}

export default EndpointCard
