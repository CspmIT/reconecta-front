import { useForm } from 'react-hook-form'
import CardCustom from '../../../../components/CardCustom'
import { Button } from '@mui/material'
import AddRecloser from '../components/AddRecloser/AddRecloser'
import Swal from 'sweetalert2'
import AddEntity from '../components/AddEntity/AddEntity'
import AddMarkerMap from '../components/Map/AddMarkerMap'

function AbmRecloser({ activo = null }) {
	const {
		register,
		setValue,
		formState: { errors },
		handleSubmit,
	} = useForm()
	const onSubmit = async (data) => {
		try {
			Swal.fire({ title: 'Perfecto!', icon: 'success', text: 'Recloser agregado correctamente' })
		} catch (e) {
			console.log(e)
		}
	}
	return (
		<CardCustom className={' w-full rounded-md text-black'}>
			<form id='formAbmRecloser' onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-wrap p-7'>
				<div className='w-full flex-row gap-3 mb-5'>
					<AddEntity register={register} errors={errors} />
					<AddMarkerMap register={register} errors={errors} setValue={setValue} />
					{activo == 'recloser' && <AddRecloser register={register} errors={errors} setValue={setValue} />}
					<div className='w-full flex justify-center mt-5'>
						<Button type='submit' variant='contained'>
							Guardar
						</Button>
					</div>
				</div>
			</form>
		</CardCustom>
	)
}

export default AbmRecloser
