import { Button } from '@mui/material'
import MapPrueba from '../components/MapPrueba'
import { ToastContainer, toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Map() {
	const center = [-30.680865, -62.011055]
	const centerCity = [-30.712865, -62.011055]
	const navigate = useNavigate()
	const showToastMessage = () => {
		toast.warn(`Nueva Alerta para ID!`, {
			position: 'top-right',
			autoClose: false,
			onClick: () => {
				navigate('/Alert')
			},
			className: 'mt-3',
			theme: 'colored',
		})
	}
	useEffect(() => {
		showToastMessage()
	}, [])

	return (
		<div className={`!min-h-[90vh] relative w-full flex`}>
			<ToastContainer className={'absolute top-0'} stacked />
			<div className='!min-h-[inherit] !shadow-md !shadow-black/40 !rounded-2xl p-2 w-1/2'>
				<MapPrueba id={1} center={center} zoom={11.6} />
			</div>
			<div className='min-h-[inherit]  !shadow-md !shadow-black/40 !rounded-2xl p-2 w-1/2'>
				<MapPrueba id={2} center={centerCity} zoom={14.5} />
			</div>
		</div>
	)
}

export default Map
