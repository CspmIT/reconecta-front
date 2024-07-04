import MapPrueba from '../components/MapPrueba'

function Map() {
	const center = [-30.680865, -62.011055]
	const centerCity = [-30.712865, -62.011055]
	return (
		<>
			<div className='min-h-[inherit] !shadow-md !shadow-black/40 !rounded-2xl p-2 w-1/2'>
				<MapPrueba id={1} key={1} center={center} zoom={11.6} />
			</div>
			<div className='min-h-[inherit]  !shadow-md !shadow-black/40 !rounded-2xl p-2 w-1/2'>
				<MapPrueba id={2} key={2} center={centerCity} zoom={14.5} />
			</div>
		</>
	)
}

export default Map
