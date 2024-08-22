import { useForm } from 'react-hook-form'
import CardCustom from '../../../components/CardCustom'
import { Button, TextField } from '@mui/material'
import AddRecloser from '../components/AddRecloser/AddRecloser'
import Swal from 'sweetalert2'
import AddEntity from '../components/AddEntity/AddEntity'
import AddMarkerMap from '../components/Map/AddMarkerMap'
import { useEffect, useState } from 'react'
import { markersExist } from '../utils/js/markersExist'
import { grayIcon, redIcon } from '../../map/utils/js/markerClass'
import { useParams } from 'react-router-dom'
import AddSubStationRural from '../components/AddSubStationRural/AddSubStationRural'
import AddMeter from '../components/AddMeter/AddMeter'
import AddSubStationUrban from '../components/AddSubStationUrban'
import AddNetAnalyzer from '../components/AddNetAnalyzer/AddNetAnalyzer'
import { getRecloser } from '../components/AddRecloser/actions'

function AbmEquipament() {
	const { name, id } = useParams()
	const [listMarkers, setListMarkers] = useState([])
	const [selectMarkers, setSelectMarkers] = useState([])
	const [dataEdit, setDataEdit] = useState([])
	const {
		register,
		setValue,
		clearErrors,
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
		setSelectMarkers({ lat: null, lng: null })
		if (action) {
			setListMarkers(markersExist)
		} else {
			setListMarkers([])
		}
	}
	//funcion para seleccionar un marcador en el mapa, desde el select
	const addMarker = (data) => {
		const { lat, lng } = listMarkers.filter((item) => item.id == data)[0] || { lat: null, lng: null }
		setSelectMarkers({ lat, lng })
		const markersActive = listMarkers.map((item) => {
			item.icon = item.id == data ? redIcon(data) : grayIcon(item.id)
			return item
		})
		setListMarkers(markersActive)
	}
	useEffect(() => {
		if (name === 'netAnalyzer') return
		if (selectMarkers?.lat) {
			clearErrors('lng_marker')
			clearErrors('lat_marker')
			setValue('lng_marker', selectMarkers.lng)
			setValue('lat_marker', selectMarkers.lat)
		} else {
			setValue('lng_marker', null)
			setValue('lat_marker', null)
		}
	}, [selectMarkers])
	const getDataEdit = async (name, id) => {
		switch (name) {
			case 'recloser':
				setDataEdit(await getRecloser(id))
				break

			default:
				break
		}
	}
	useEffect(() => {
		if (id) {
			getDataEdit(name, id)
		}
	}, [])
	return (
		<CardCustom className={' w-full rounded-md text-black'}>
			<form id='formAbmRecloser' onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-wrap p-7'>
				<div className='w-full flex-row gap-3 mb-5'>
					{name !== 'netAnalyzer' && (
						<>
							<AddEntity
								register={register}
								errors={errors}
								setValue={setValue}
								addMarker={addMarker}
								dataEdit={dataEdit}
								enableMarkers={enableMarkers}
								setSelectMarkers={setSelectMarkers}
							/>
							<AddMarkerMap
								register={register}
								errors={errors}
								setValue={setValue}
								selectMarkers={selectMarkers}
								setSelectMarkers={setSelectMarkers}
								listMarkers={listMarkers}
							/>
						</>
					)}
					{name == 'recloser' && (
						<AddRecloser register={register} errors={errors} dataEdit={dataEdit} setValue={setValue} />
					)}
					{name == 'meter' && <AddMeter register={register} errors={errors} setValue={setValue} />}
					{name == 'subStationUrban' && (
						<AddSubStationUrban
							register={register}
							errors={errors}
							setValue={setValue}
							clearErrors={clearErrors}
						/>
					)}
					{name == 'subStationRural' && (
						<AddSubStationRural
							register={register}
							errors={errors}
							setValue={setValue}
							clearErrors={clearErrors}
						/>
					)}
					{name == 'netAnalyzer' && (
						<AddNetAnalyzer register={register} errors={errors} setValue={setValue} />
					)}
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
