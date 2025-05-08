import { TextField } from '@mui/material'

function Header({ info }) {
	return (
		<>
			<div className='w-full mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2 px-4'>
				<TextField
					type='text'
					disabled
					label='Nombre'
					className='w-full !text-black'
					defaultValue={`${info?.elements?.name} - ${info?.observation}`}
				/>
				<TextField
					type='text'
					disabled
					label='Nro Serie'
					className='w-full !text-black'
					defaultValue={info?.serial}
				/>
				<TextField
					type='text'
					disabled
					label='Configuración'
					className='w-full !text-black'
					defaultValue={info?.configuration === 1 ? 'Estandar' : "Especial"}
				/>
				<div className='w-full grid gap-3 grid-cols-2'>
					<TextField
						type='text'
						disabled
						label='Marca'
						className='w-full !text-black'
						defaultValue={info?.brand}
					/>
					<TextField
						type='text'
						disabled
						label='Version'
						className='w-full !text-black'
						defaultValue={info.version}
					/>
				</div>
			</div>
			<div className='w-full flex justify-center items-center'>
				<div className='w-full sm:w-2/4 border-2 border-solid border-slate-400 rounded-md flex p-4 mt-5'>
					<div className='w-full p-1'>
						<p className='font-semibold w-full text-center'>Tensión de batería:</p>
						<p className='font-semibold w-full text-center'>{info.Bat_0} V</p>
					</div>
					<div className='w-full p-1'>
						<p className='font-semibold w-full text-center'>Diferencia de Hora</p>
						<p className='font-semibold w-full text-center'>{info.Dif_Time}</p>
					</div>
				</div>
			</div>
			<p className='font-semibold w-full text-center mt-4'>Último registro de datos: {info.Date}</p>
		</>
	)
}

export default Header
