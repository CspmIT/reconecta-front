import { useEffect, useState } from 'react'
import RowsValues from './rowsValues'
import styles from './styles.module.css'
import { request } from '../../../../../utils/js/request'
import { backend } from '../../../../../utils/routes/app.routes'

const MetrologyBoard = ({ analyzer }) => {
	const [info, setInfo] = useState([])
	const [loading, setLoading] = useState(true)
	const getData = async () => {
		try {
			const body = {
				brand: analyzer?.equipmentmodels?.name.toLowerCase(),
				version: analyzer?.equipmentmodels?.brand.toLowerCase(),
				serial: analyzer?.serial,
			}
			const { data } = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/Analyzer`, 'POST', body)
			setInfo(data)
			setLoading(false)
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		getData()
	}, [])
	return (
		!loading &&
		<div className='w-full flex flex-row flex-wrap justify-center'>
			<div className='w-full flex flex-row mb-5'>
				<div className='w-0 md:w-2/6'></div>
				<RowsValues valueR='Fase R' valueS='Fase S' valueT='Fase T' valueTotal='Totales' />
			</div>
			<div className='w-full md:w-2/6 md:my-2 flex flex-row p-2 bg-sky-100 md:bg-inherit md:p-0 flex-wrap justify-center'>
				<div className='w-full md:w-8/12'>
					<h1 className='w-full md:w-1/4 text-center md:text-left text-xl text-black'>Tensión</h1>
				</div>
			</div>
			<RowsValues valueR={`${info?.f_0_v} V`} valueS={`${info?.f_1_v} V`} valueT={`${info?.f_2_v} V`} valueTotal='-' bg='bg-sky-100 md:bg-inherit' />
			<div className='w-full md:w-2/6 md:my-2 flex flex-row p-2 md:p-0 bg-gray-300 md:bg-inherit flex-wrap justify-center'>
				<div className='w-8/12'>
					<h1 className='md:w-1/4 text-center md:text-left text-xl text-black'>Corriente</h1>
				</div>
			</div>
			<RowsValues valueR={`${info?.f_0_i} A`} valueS={`${info?.f_1_i} A`} valueT={`${info?.f_2_i} A`} valueTotal='-' bg='bg-sky-100 md:bg-inherit' />
			<div className='w-full md:w-2/6 md:my-2 flex flex-row flex-wrap p-2 bg-sky-100 md:bg-inherit md:p-0 justify-center'>
				<div className='w-8/12'>
					<h1 className='md:w-1/4 text-center md:text-left text-xl text-black'>Cos Ø</h1>
				</div>
			</div>
			<RowsValues valueR={info?.cos_0} valueS={info?.cos_1} valueT={info?.cos_2} valueTotal={info?.cos_total} bg='bg-sky-100 md:bg-inherit' />
			<div className='w-full flex flex-row flex-wrap justify-center p-2 md:p-0 bg-gray-300 md:bg-inherit'>
				<div className='w-full md:w-2/6 my-2  flex flex-row flex-wrap justify-center'>
					<div className='w-8/12'>
						<h1 className='md:w-1/4 text-center md:text-left text-xl text-black'>Potencia</h1>
					</div>
				</div>
				<div className='w-0 md:w-4/6'></div>
				<div className='w-full md:w-2/6 flex flex-row flex-wrap justify-center'>
					<div className='flex flex-row w-full md:w-6/12 p-2 md:p-0 bg-gray-200 md:bg-inherit'>
						<div className='w-1/12 text-center hidden md:block'>
							<span className={styles.linea_rama}></span>
							<span className={styles.linea_seguimiento}></span>
						</div>
						<div className='w-full md:w-4/12'>
							<h1 className='text-left text-black'>Activa Neta</h1>
						</div>
					</div>
				</div>
				<RowsValues valueR={`${info?.f_0_p} kW`} valueS={`${info?.f_1_p} kW`} valueT={`${info?.f_2_p} kW`} valueTotal={`${info?.pot_activa} kW`} bg='bg-gray-200' />
				<div className='w-full md:w-2/6 md:py-2 flex flex-row flex-wrap justify-center'>
					<div className='flex flex-row w-full md:w-6/12 p-2 md:p-0 bg-yellow-50 md:bg-inherit'>
						<div className='w-1/12 text-center hidden md:block'>
							<span className={styles.linea_rama}></span>
							<span className={styles.linea_seguimiento}></span>
						</div>
						<div className='w-full md:w-11/12'>
							<h1 className='text-left text-black'>Reactiva Neta</h1>
						</div>
					</div>
				</div>
				<RowsValues valueR={`${info?.f_0_q} kVAr`} valueS={`${info?.f_1_q} kVAr`} valueT={`${info?.f_2_q} kVAr`} valueTotal={`${info?.pot_reactiva} kVAr`} bg='bg-yellow-50 md:bg-inherit' />
				<div className='w-full md:w-2/6 flex flex-row flex-wrap justify-center'>
					<div className='flex flex-row w-full md:w-6/12 p-2 md:p-0 bg-gray-200 md:bg-inherit'>
						<div className='w-1/12 text-center hidden md:block'>
							<span className={styles.linea_rama}></span>
						</div>
						<div className='w-full md:w-11/12'>
							<h1 className='text-left text-black'>Aparente Neta</h1>
						</div>
					</div>
				</div>
				<RowsValues valueR={`${info?.aparent_0} kVA`} valueS={`${info?.aparent_1} kVA`} valueT={`${info?.aparent_2} kVA`} valueTotal={`${info?.pot_aparente} kVA`} bg='bg-gray-200 md:bg-inherit' />
			</div>

			<div className='w-full'>
				<hr className='my-4 border-slate-400 dark:border-slate-200' />
			</div>
			<div className='w-full flex flex-row flex-wrap justify-center p-2 md:p-0 bg-sky-100 md:bg-inherit'>
				<div className='w-full md:w-2/6 my-2 flex flex-row flex-wrap justify-center'>
					<div className='w-8/12'>
						<h1 className='md:w-1/4 text-center md:text-left text-xl text-black'>Energía</h1>
					</div>
				</div>
				<div className='w-0 md:w-4/6'></div>
				<div className='w-full md:w-2/6 flex flex-row flex-wrap justify-center'>
					<div className='flex flex-row w-full md:w-6/12 p-2 md:p-0 bg-gray-300 md:bg-inherit'>
						<div className='w-1/12 text-center hidden md:block'>
							<span className={styles.linea_rama}></span>
							<span className={styles.linea_seguimiento}></span>
						</div>
						<div className='w-full md:w-4/12'>
							<h1 className='text-left text-lg py-1 md:py-0 text-black'>Activa</h1>
						</div>
					</div>
				</div>
				<div className='w-full md:w-4/6'></div>
				<div className='w-full md:w-2/6 flex flex-row flex-wrap justify-center'>
					<div className='flex flex-row w-full md:w-6/12 p-2 md:p-0 bg-gray-200 md:bg-inherit'>
						<div className='w-1/12 text-center hidden md:block'>
							<span className={styles.linea_vertical_continua}></span>
						</div>
						<div className='w-11/12 flex flex-row'>
							<div className='w-1/12 text-center hidden md:block'>
								<span className={styles.linea_rama}></span>
								<span className={styles.linea_seguimiento}></span>
							</div>
							<div>
								<h1 className='text-left text-black'>Neta</h1>
							</div>
						</div>
					</div>
				</div>
				<RowsValues valueR={`${info?.f_0_a} kWh`} valueS={`${info?.f_1_a} kWh`} valueT={`${info?.f_2_a} kWh`} valueTotal={`${info?.ener_activa} kWh`} bg='bg-gray-200' />
				<div className='w-full md:w-2/6 flex flex-row flex-wrap justify-center'>
					<div className='flex flex-row w-full md:w-6/12 p-2 md:p-0 bg-yellow-50 md:bg-inherit'>
						<div className='w-1/12 text-center hidden md:block'>
							<span className={styles.linea_vertical_continua}></span>
						</div>
						<div className='w-11/12 flex flex-row'>
							<div className='w-1/12 text-center hidden md:block'>
								<span className={styles.linea_rama}></span>
								<span className={styles.linea_seguimiento}></span>
							</div>
							<div>
								<h1 className='text-left text-black'>Importada</h1>
							</div>
						</div>
					</div>
				</div>
				<RowsValues valueR='-' valueS='-' valueT='-' valueTotal={`${info?.f_0_ain} kWh`} bg='bg-yellow-50 md:bg-inherit' />
				<div className='w-full md:w-2/6 flex flex-row flex-wrap justify-center'>
					<div className='flex flex-row w-full md:w-6/12 p-2 md:p-0 bg-gray-200'>
						<div className='w-1/12 text-center hidden md:block'>
							<span className={styles.linea_vertical_continua}></span>
						</div>
						<div className='w-11/12 flex flex-row'>
							<div className='w-1/12 text-center hidden md:block'>
								<span className={styles.linea_rama}></span>
							</div>
							<div>
								<h1 className='text-left text-black'>Exportada</h1>
							</div>
						</div>
					</div>
				</div>
				<RowsValues valueR='-' valueS='-' valueT='-' valueTotal={`${info?.f_0_aout} kWh`} bg='bg-gray-200 md:bg-inherit' />
				<div className='w-full md:w-2/6 flex flex-row flex-wrap justify-center'>
					<div className='flex flex-row w-full md:w-6/12 p-2 md:p-0 bg-gray-300 md:bg-inherit'>
						<div className='w-1/12 text-center hidden md:block'>
							<span className={styles.linea_rama}></span>
						</div>
						<div className='w-full md:w-4/12'>
							<h1 className='text-left text-lg py-1 md:py-0 text-black'>Reactiva</h1>
						</div>
					</div>
				</div>
				<div className='w-0 md:w-4/6'></div>
				<div className='w-full md:w-2/6 flex flex-row flex-wrap justify-center'>
					<div className='flex flex-row w-full md:w-6/12 p-2 md:p-0 bg-yellow-50 md:bg-inherit'>
						<div className='w-0 md:w-1/12 text-center'></div>
						<div className='w-11/12 flex flex-row'>
							<div className='w-1/12 text-center hidden md:block'>
								<span className={styles.linea_rama}></span>
								<span className={styles.linea_seguimiento}></span>
							</div>
							<div>
								<h1 className='text-left text-black'>Neta</h1>
							</div>
						</div>
					</div>
				</div>
				<RowsValues valueR={`${info?.f_0_r} kVArh`} valueS={`${info?.f_1_r} kVArh`} valueT={`${info?.f_2_r} kVArh`} valueTotal={`${info?.ener_reactiva} kVArh`} bg='bg-yellow-50 md:bg-inherit' />
				<div className='w-full md:w-2/6 flex flex-row flex-wrap justify-center'>
					<div className='flex flex-row w-full md:w-6/12 p-2 md:p-0 bg-gray-200'>
						<div className='w-0 md:w-1/12 text-center'></div>
						<div className='w-11/12 flex flex-row'>
							<div className='w-1/12 text-center hidden md:block'>
								<span className={styles.linea_rama}></span>
								<span className={styles.linea_seguimiento}></span>
							</div>
							<div>
								<h1 className='text-left text-black'>Importada</h1>
							</div>
						</div>
					</div>
				</div>
				<RowsValues valueR='-' valueS='-' valueT='-' valueTotal={`${info?.f_1_ain} kVArh`} bg='bg-gray-200 md:bg-inherit' />
				<div className='w-full md:w-2/6 flex flex-row flex-wrap justify-center'>
					<div className='flex flex-row w-full md:w-6/12 p-2 md:p-0 bg-yellow-50 md:bg-inherit'>
						<div className='w-0 md:w-1/12 text-center'></div>
						<div className='w-10/12 flex flex-row'>
							<div className='w-1/12 text-center hidden md:block'>
								<span className={styles.linea_rama}></span>
							</div>
							<div>
								<h1 className='text-left text-black'>Exportada</h1>
							</div>
						</div>
					</div>
				</div>
				<RowsValues valueR='-' valueS='-' valueT='-' valueTotal={`${info?.f_2_aout} kVArh`} bg='bg-yellow-50 md:bg-inherit' />
			</div>
		</div>

	)
}

export default MetrologyBoard
