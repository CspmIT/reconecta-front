import React from 'react'
import RowsValues from './rowsValues'
import styles from './styles.module.css'

const MetrologyBoard = () => {
	return (
		<div className='w-full flex flex-row flex-wrap justify-center'>
			<div className='w-full flex flex-row mb-5'>
				<div className='w-2/6'></div>
				<RowsValues valueR='Fase R' valueS='Fase S' valueT='Fase T' valueTotal='Totales' />
			</div>
			<div className='w-2/6 my-2 flex flex-row flex-wrap justify-center'>
				<div className='w-8/12'>
					<h1 className='md:w-1/4 text-center md:text-left text-xl'>Tensión</h1>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
			<div className='w-2/6 my-2 flex flex-row flex-wrap justify-center'>
				<div className='w-8/12'>
					<h1 className='md:w-1/4 text-center md:text-left text-xl'>Corriente</h1>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
			<div className='w-2/6 my-2 flex flex-row flex-wrap justify-center'>
				<div className='w-8/12'>
					<h1 className='md:w-1/4 text-center md:text-left text-xl'>Cos Ø</h1>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
			<div className='w-2/6 my-2 flex flex-row flex-wrap justify-center'>
				<div className='w-8/12'>
					<h1 className='md:w-1/4 text-center md:text-left text-xl'>Potencia</h1>
				</div>
			</div>
			<div className='w-4/6'></div>
			<div className='w-2/6 flex flex-row flex-wrap justify-center'>
				<div className='flex flex-row w-6/12'>
					<div className='w-1/12 text-center'>
						<span className={styles.linea_rama}></span>
						<span className={styles.linea_seguimiento}></span>
					</div>
					<div className='w-4/12'>
						<h1 className='text-left'>Activa Neta</h1>
					</div>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
			<div className='w-2/6 py-2 flex flex-row flex-wrap justify-center'>
				<div className='flex flex-row w-6/12'>
					<div className='w-1/12 text-center'>
						<span className={styles.linea_rama}></span>
						<span className={styles.linea_seguimiento}></span>
					</div>
					<div className='w-11/12'>
						<h1 className='text-left'>Reactiva Neta</h1>
					</div>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
			<div className='w-2/6 flex flex-row flex-wrap justify-center'>
				<div className='flex flex-row w-6/12'>
					<div className='w-1/12 text-center'>
						<span className={styles.linea_rama}></span>
					</div>
					<div>
						<h1 className='text-left'>Aparente Neta</h1>
					</div>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
			<div className='w-full'>
				<hr className='my-4 border-slate-400 dark:border-slate-200' />
			</div>
			<div className='w-2/6 my-2 flex flex-row flex-wrap justify-center'>
				<div className='w-8/12'>
					<h1 className='md:w-1/4 text-center md:text-left text-xl'>Energía</h1>
				</div>
			</div>
			<div className='w-4/6'></div>
			<div className='w-2/6 flex flex-row flex-wrap justify-center'>
				<div className='flex flex-row w-6/12'>
					<div className='w-1/12 text-center'>
						<span className={styles.linea_rama}></span>
						<span className={styles.linea_seguimiento}></span>
					</div>
					<div className='w-4/12'>
						<h1 className='text-left text-lg'>Activa</h1>
					</div>
				</div>
			</div>
			<div className='w-4/6'></div>
			<div className='w-2/6 flex flex-row flex-wrap justify-center'>
				<div className='flex flex-row w-6/12'>
					<div className='w-1/12 text-center'>
						<span className={styles.linea_vertical_continua}></span>
					</div>
					<div className='w-11/12 flex flex-row'>
						<div className='w-1/12 text-center'>
							<span className={styles.linea_rama}></span>
							<span className={styles.linea_seguimiento}></span>
						</div>
						<div>
							<h1 className='text-left'>Neta</h1>
						</div>
					</div>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
			<div className='w-2/6 flex flex-row flex-wrap justify-center'>
				<div className='flex flex-row w-6/12'>
					<div className='w-1/12 text-center'>
						<span className={styles.linea_vertical_continua}></span>
					</div>
					<div className='w-11/12 flex flex-row'>
						<div className='w-1/12 text-center'>
							<span className={styles.linea_rama}></span>
							<span className={styles.linea_seguimiento}></span>
						</div>
						<div>
							<h1 className='text-left'>Importada</h1>
						</div>
					</div>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
			<div className='w-2/6 flex flex-row flex-wrap justify-center'>
				<div className='flex flex-row w-6/12'>
					<div className='w-1/12 text-center'>
						<span className={styles.linea_vertical_continua}></span>
					</div>
					<div className='w-11/12 flex flex-row'>
						<div className='w-1/12 text-center'>
							<span className={styles.linea_rama}></span>
						</div>
						<div>
							<h1 className='text-left'>Exportada</h1>
						</div>
					</div>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
			<div className='w-2/6 flex flex-row flex-wrap justify-center'>
				<div className='flex flex-row w-6/12'>
					<div className='w-1/12 text-center'>
						<span className={styles.linea_rama}></span>
					</div>
					<div className='w-4/12'>
						<h1 className='text-left text-lg'>Reactiva</h1>
					</div>
				</div>
			</div>
			<div className='w-4/6'></div>
			<div className='w-2/6 flex flex-row flex-wrap justify-center'>
				<div className='flex flex-row w-6/12'>
					<div className='w-1/12 text-center'></div>
					<div className='w-11/12 flex flex-row'>
						<div className='w-1/12 text-center'>
							<span className={styles.linea_rama}></span>
							<span className={styles.linea_seguimiento}></span>
						</div>
						<div>
							<h1 className='text-left'>Neta</h1>
						</div>
					</div>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
			<div className='w-2/6 flex flex-row flex-wrap justify-center'>
				<div className='flex flex-row w-6/12'>
					<div className='w-1/12 text-center'></div>
					<div className='w-11/12 flex flex-row'>
						<div className='w-1/12 text-center'>
							<span className={styles.linea_rama}></span>
							<span className={styles.linea_seguimiento}></span>
						</div>
						<div>
							<h1 className='text-left'>Importada</h1>
						</div>
					</div>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
			<div className='w-2/6 flex flex-row flex-wrap justify-center'>
				<div className='flex flex-row w-6/12'>
					<div className='w-1/12 text-center'></div>
					<div className='w-10/12 flex flex-row'>
						<div className='w-1/12 text-center'>
							<span className={styles.linea_rama}></span>
						</div>
						<div>
							<h1 className='text-left'>Exportada</h1>
						</div>
					</div>
				</div>
			</div>
			<RowsValues valueR='-' valueS='-' valueT='-' valueTotal='-' />
		</div>
	)
}

export default MetrologyBoard
