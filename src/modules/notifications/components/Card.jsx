/*
 * Contenedor visual compartido por las secciones del modulo. Repite el patron
 * de tarjeta que ya usan las otras vistas (borde suave, fondo blanco/zinc).
 */
const Card = ({ title, description, children, right }) => {
	return (
		<section className='w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-gray-700 rounded-2xl p-5'>
			<header className='flex flex-wrap items-start justify-between gap-3 mb-4'>
				<div>
					<h2 className='text-base font-semibold text-slate-800 dark:text-gray-100'>{title}</h2>
					{description ? <p className='text-sm text-slate-500 dark:text-gray-400 mt-1'>{description}</p> : null}
				</div>
				{right}
			</header>
			{children}
		</section>
	)
}

export default Card
