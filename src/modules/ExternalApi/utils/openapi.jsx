/*
 * Utilidades para mostrar la especificación OpenAPI que publica el backend. Se
 * cubre solo lo que usa esa especificación (GET, parámetros de path y query,
 * $ref a components): no es un visor OpenAPI genérico.
 */

export const resolveRef = (spec, schema) => {
	if (!schema?.$ref) return schema
	const name = schema.$ref.split('/').pop()
	return spec.components?.schemas?.[name] || {}
}

/**
 * Respuesta de ejemplo armada con el schema, para mostrar la forma de los datos.
 */
export const exampleFrom = (spec, rawSchema, depth = 0) => {
	const schema = resolveRef(spec, rawSchema)
	if (!schema || depth > 6) return null
	if (schema.example !== undefined) return schema.example
	if (schema.enum) return schema.enum[0]
	if (schema.type === 'array') {
		const count = schema.minItems || 1
		return Array.from({ length: count }, () => exampleFrom(spec, schema.items, depth + 1))
	}
	if (schema.type === 'object' || schema.properties || schema.additionalProperties) {
		const out = {}
		Object.entries(schema.properties || {}).forEach(([key, value]) => {
			out[key] = exampleFrom(spec, value, depth + 1)
		})
		if (schema.additionalProperties) out['<campo>'] = exampleFrom(spec, schema.additionalProperties, depth + 1)
		return out
	}
	if (schema.type === 'string') return schema.format === 'date-time' ? '2026-09-25T12:00:00.000Z' : 'string'
	if (schema.type === 'integer') return 1
	if (schema.type === 'number') return 0.0
	if (schema.type === 'boolean') return true
	return null
}

/**
 * Path concreto con los valores cargados: reemplaza los de path y agrega los de
 * query que no estén vacíos.
 */
export const buildPath = (path, parameters = [], values = {}) => {
	let result = path
	const query = new URLSearchParams()
	parameters.forEach((param) => {
		const value = values[param.name]
		if (param.in === 'path') result = result.replace(`{${param.name}}`, value ? encodeURIComponent(value) : `{${param.name}}`)
		else if (value !== undefined && value !== '') query.set(param.name, value)
	})
	const qs = query.toString()
	return qs ? `${result}?${qs}` : result
}

export const curlFor = (baseUrl, path, token) =>
	`curl -H "Authorization: Bearer ${token || '<token>'}" \\\n  "${baseUrl}${path}"`

export const paramType = (schema = {}) => {
	if (schema.enum) return schema.enum.join(' | ')
	if (schema.format) return `${schema.type} (${schema.format})`
	return schema.type || '—'
}

/**
 * Markdown mínimo para las descripciones de la especificación: párrafos,
 * listas con guion, **negrita** y `código`.
 */
const inline = (text) =>
	text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
		if (part.startsWith('**') && part.endsWith('**')) return <b key={i}>{part.slice(2, -2)}</b>
		if (part.startsWith('`') && part.endsWith('`'))
			return (
				<code key={i} className='rounded bg-slate-100 px-1 text-[0.85em] dark:bg-zinc-800'>
					{part.slice(1, -1)}
				</code>
			)
		return part
	})

export const Markdown = ({ text = '', className = '' }) => {
	const blocks = text.split(/\n\s*\n/)
	return (
		<div className={`flex flex-col gap-2 text-sm text-slate-600 dark:text-gray-300 ${className}`}>
			{blocks.map((block, i) => {
				const lines = block.split('\n')
				if (lines.every((line) => line.trim().startsWith('- ')))
					return (
						<ul key={i} className='list-disc pl-5'>
							{lines.map((line, j) => (
								<li key={j}>{inline(line.trim().slice(2))}</li>
							))}
						</ul>
					)
				return <p key={i}>{inline(lines.join(' '))}</p>
			})}
		</div>
	)
}
