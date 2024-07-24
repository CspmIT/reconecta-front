import { useForm } from 'react-hook-form'
import CardCustom from '../../../components/CardCustom'
import { Button } from '@mui/material'
import AddRecloser from '../components/AddRecloser/AddRecloser'
import Swal from 'sweetalert2'
import AddEntity from '../components/AddEntity/AddEntity'
import AddMarkerMap from '../components/Map/AddMarkerMap'
import { useState } from 'react'
import { markersExist } from '../utils/js/markersExist'
import { grayIcon, redIcon } from '../../map/utils/js/markerClass'
import { useParams } from 'react-router-dom'

function AbmEquipament() {
	const { name } = useParams(['name'])
	const [listMarkers, setListMarkers] = useState([])
	const [selectMarkers, setSelectMarkers] = useState([])
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
	const enableMarkers = (action) => {
		if (action) {
			setListMarkers(markersExist)
		} else {
			setListMarkers([])
			setSelectMarkers([])
		}
	}
	const addMarker = (data) => {
		const { lat, lng } = listMarkers.filter((item) => item.id == data)[0] || { lat: null, lng: null }
		setSelectMarkers({ lat, lng })
		const markersActive = listMarkers.map((item) => {
			item.icon = item.id == data ? redIcon(data) : grayIcon(item.id)
			return item
		})
		setListMarkers(markersActive)
	}
	return (
		<CardCustom className={' w-full rounded-md text-black'}>
			<form id='formAbmRecloser' onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-wrap p-7'>
				<div className='w-full flex-row gap-3 mb-5'>
					<AddEntity
						register={register}
						errors={errors}
						setValue={setValue}
						addMarker={addMarker}
						enableMarkers={enableMarkers}
					/>
					<AddMarkerMap
						register={register}
						errors={errors}
						setValue={setValue}
						selectMarkers={selectMarkers}
						listMarkers={listMarkers}
					/>
					{name == 'recloser' && <AddRecloser register={register} errors={errors} setValue={setValue} />}
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

export default AbmEquipament
