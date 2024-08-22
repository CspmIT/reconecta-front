import { useContext } from 'react'

import Swal from 'sweetalert2'
import { MainContext } from '../../../../context/MainContext'
import { useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'

const EditUserRecloser = ({ data }) => {
	const { tabs, setTabs, tabCurrent, setTabCurrent } = useContext(MainContext)
	const navigate = useNavigate()

	const SaveMenu = () => {
		Swal.fire({
			title: 'Perfeto',
			text: 'Se guardo correctamente los cambios del usuario',
			icon: 'success',
		})
		navigate('/config/security')
		setTabs(tabs.filter((_, index) => index !== tabCurrent))
		setTabCurrent((prev) => prev - 1)
	}
	const {
		register,
		setValue,
		clearErrors,
		formState: { errors },
		handleSubmit,
	} = useForm()

	const onSubmit = async (data) => {
		try {
			Swal.fire({
				title: 'Perfeto',
				text: 'Se guardo correctamente los cambios del usuario',
				icon: 'success',
			})
			navigate('/config/security')
			setTabs(tabs.filter((_, index) => index !== tabCurrent))
			setTabCurrent((prev) => prev - 1)
		} catch (e) {
			console.log(e)
		}
	}
	return (
		<div className='w-full'>
			<form
				id='formAbmRecloser'
				onSubmit={handleSubmit(onSubmit)}
				className='w-full  h-[60vh] flex flex-col justify-center items-center p-7'
			>
				<div className='w-full  flex justify-center'>
					<div className='w-full md:w-1/3 p-2'>
						<TextField
							type='text'
							label={``}
							disabled
							className='w-full'
							value={`${data.last_name} ${data.first_name}`}
							defaultValue={`${data.last_name} ${data.first_name}`}
						/>
					</div>
					<div className='w-full md:w-1/3 p-2'>
						<TextField
							error={errors.password ? true : false}
							type='text'
							label={`Contraseña`}
							{...register('password', { required: 'El Campo es requerido' })}
							className='w-full'
							helperText={errors.password && errors.password.message}
							value={data.password}
							defaultValue={data.password}
						/>
					</div>
				</div>
				<div className='w-full flex justify-center p-2'>
					<Button variant='contained' type='submit'>
						Guardar
					</Button>
				</div>
			</form>
		</div>
	)
}

export default EditUserRecloser
