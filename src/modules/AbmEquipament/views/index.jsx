import { useForm } from 'react-hook-form'
import CardCustom from '../../../components/CardCustom'
import { Button } from '@mui/material'
import Swal from 'sweetalert2'
import AddNode from '../components/AddNode/AddNode'
import AddMarkerMap from '../components/Map/AddMarkerMap'
import { useEffect, useState } from 'react'
import { markersExist } from '../utils/js/markersExist'
import { grayIcon, redIcon } from '../../map/utils/js/markerClass'
import { useNavigate, useParams } from 'react-router-dom'
import AddSubStationRural from '../components/AddSubStationRural/AddSubStationRural'
import AddSubStationUrban from '../components/AddSubStationUrban'
import { saveRecloser, saveStationRural, saveStationUrban } from '../utils/js/saveActive'
import AddElementElectric from '../components/AddElementElectric'
import { getNode, getRecloser } from '../../AbmDevice/components/AddRecloser/actions'
import { saveNode } from '../utils/js/nodeAction'

function AbmEquipament() {
	const navigate = useNavigate()
	const { name, id } = useParams()
	const [selectMarkers, setSelectMarkers] = useState([])
	const [dataEdit, setDataEdit] = useState([])
	const {
		register,
		setValue,
		clearErrors,
		formState: { errors },
		handleSubmit,
	} = useForm()

	const onSubmit = async (info) => {
		try {
			await saveNode(info)
			Swal.fire({ title: 'Perfecto!', icon: 'success', text: 'Recloser agregado correctamente' })
			if (info.id_recloser != 0) {
				navigate('/tabs')
			} else {
				navigate('/Home')
			}
		} catch (e) {
			Swal.fire({
				title: '¡Atención!',
				text: e.message,
				icon: 'warning',
			})
		}
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
			case 'node':
				setDataEdit(await getNode(id))
				break

			default:
				break
		}
	}
	const [infra, setInfra] = useState(null)
	const changeInfra = (option) => {
		setInfra(option)
		setValue('type', option)
	}
	useEffect(() => {
		if (id) {
			getDataEdit(name, id)
		}
	}, [])
	console.log(dataEdit)
	return (
		<div className={'w-full flex justify-center items-center rounded-md text-black'}>
			<CardCustom className={'w-full rounded-md text-black'}>
				<form id='formAbmRecloser' onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-wrap p-7'>
					<div className='w-full flex-row gap-3 mb-5'>
						{name == 'node' && (
							<>
								<AddNode
									register={register}
									changeInfra={changeInfra}
									errors={errors}
									setValue={setValue}
									dataEdit={dataEdit}
								/>
								<AddMarkerMap
									register={register}
									errors={errors}
									dataEdit={dataEdit}
									setSelectMarkers={setSelectMarkers}
								/>
							</>
						)}
						{infra == 'subStationUrban' && (
							<AddSubStationUrban
								register={register}
								errors={errors}
								setValue={setValue}
								clearErrors={clearErrors}
							/>
						)}
						{infra == 'subStationRural' && (
							<AddSubStationRural
								register={register}
								errors={errors}
								setValue={setValue}
								clearErrors={clearErrors}
							/>
						)}
						{infra && <AddElementElectric setValue={setValue} dataEdit={dataEdit} />}
						<div className='w-full flex justify-center mt-5'>
							<Button type='submit' variant='contained'>
								Guardar
							</Button>
						</div>
					</div>
				</form>
			</CardCustom>
		</div>
	)
}

export default AbmEquipament
