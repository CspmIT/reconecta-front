import CardCustom from '../../../components/CardCustom'
import { Button } from '@mui/material'
import AddRecloser from '../components/AddRecloser/AddRecloser'
import { useParams } from 'react-router-dom'
import AddMeter from '../components/AddMeter/AddMeter'
import AddNetAnalyzer from '../components/AddNetAnalyzer/AddNetAnalyzer'

function AbmDevice() {
	const { name, id } = useParams()
	return (
		<div className={'w-full flex justify-center items-center rounded-md text-black'}>
			<CardCustom className={'w-full rounded-md text-black'}>
				<div className='w-full flex-row gap-3 mb-5'>
					{(name == 'recloser' || infra == 'recloser') && <AddRecloser id={id} />}
					{name == 'meter' && <AddMeter register={register} errors={errors} setValue={setValue} />}
					{name == 'netAnalyzer' && (
						<AddNetAnalyzer register={register} errors={errors} setValue={setValue} />
					)}
				</div>
			</CardCustom>
		</div>
	)
}

export default AbmDevice
