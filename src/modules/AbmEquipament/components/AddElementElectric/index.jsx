import { Button, MenuItem, Popper, TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'
import { ColumnsDevice } from './columnsTableDevice'
import TableCustom from '../../../../components/TableCustom'

function AddElementElectric({ setValue, dataEdit }) {
	const [anchorEl, setAnchorEl] = useState(null)
	const [openSub, setOpenSub] = useState(false)
	const [selectElement, setSelectElement] = useState([])
	const [listElement, setListElement] = useState([])
	const handleOpen = (evento) => {
		setOpenSub(!openSub)
		setAnchorEl(evento.currentTarget)
	}
	const addElementSelect = async (element) => {
		let info
		let listElement = []
		setOpenSub(false)
		switch (element) {
			case 1:
				info = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getReclosersEnabled`, 'GET')
				listElement = info.data.map((item) => {
					return {
						...item,
						brand: item.brand + ' - ' + item.version,
						identification: item.serial,
						type_element: element,
					}
				})
				break
			case 2:
				break
			case 3:
				break

			default:
				break
		}
		setSelectElement(listElement)
	}
	const addElementList = (device) => {
		const deviceSelect = selectElement.filter((item) => item.id == device)
		const result = listElement.filter((item) => item.id != deviceSelect[0].id)
		setListElement([...result, ...deviceSelect])
		const resiltAll = [...result, ...deviceSelect]
		setValue('devices', resiltAll)
		setSelectElement([])
	}
	const removeElementList = (id) => {
		const result = listElement.filter((item) => item.id != id)
		setListElement(result)
		setValue('devices', result)
	}
	const selectType = useRef(null)
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (selectType.current && !selectType.current.contains(event.target)) {
				setOpenSub(false)
			}
		}

		if (openSub) {
			document.addEventListener('mousedown', handleClickOutside)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [openSub])
	const getDevice = async (id) => {
		let info = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/getRecloserxID?id=${id}`, 'GET')
		let deviceItem = {
			...info.data,
			brand: info.data.brand + ' - ' + info.data.version,
			identification: info.data.serial,
			type_element: 1,
		}
		return deviceItem
	}
	const getlistdevice = async (data) => {
		let list = []
		for (const item of data.node_history) {
			let deviceItem
			switch (item.type_device) {
				case 1:
					deviceItem = await getDevice(item.id_device)
					break
				case 2:
					break
				case 3:
					break

				default:
					break
			}
			list.push(deviceItem)
		}
		setListElement(list)
		setValue('devices', list)
	}
	useEffect(() => {
		if (dataEdit) {
			getlistdevice(dataEdit)
		}
	}, [dataEdit])

	return (
		<>
			<div className='flex flex-col w-full !justify-center !items-center'>
				<Button
					onClick={handleOpen}
					className='!flex !px-4 !p-2 !justify-center !items-center'
					variant='contained'
				>
					Elemento Electrico
				</Button>
				<Popper
					ref={selectType}
					className='bg-slate-100 z-40 gap-1 p-2 rounded-lg shadow-md flex flex-col justify-start'
					placement='top'
					open={openSub}
					anchorEl={anchorEl}
				>
					<MenuItem onClick={() => addElementSelect(1)} className='hover:!bg-slate-300 !rounded-lg'>
						<p className='text-black font-semibold'>Reconectador</p>
					</MenuItem>
					<MenuItem onClick={() => addElementSelect(2)} className='hover:!bg-slate-300 !rounded-lg'>
						<p className='text-black font-semibold'>Medidor</p>
					</MenuItem>
					{/* <MenuItem
						onClick={() => addElementSelect(3)}
						className='hover:!bg-slate-300 !rounded-lg'
					>
						<p className='text-black font-semibold'>Analizador de Red</p>
					</MenuItem> */}
				</Popper>
			</div>
			{selectElement.length > 0 && (
				<div className='flex flex-col w-full items-center mt-3'>
					<TextField
						select
						label={`Elementos`}
						className='w-1/2'
						defaultValue={''}
						onChange={(e) => {
							addElementList(e.target.value)
						}}
					>
						<MenuItem key={0} value={''}>
							<em>Elemento</em>
						</MenuItem>
						{selectElement.map((item, index) => {
							return (
								<MenuItem key={index} value={item.id}>
									{item.identification}
								</MenuItem>
							)
						})}
					</TextField>
				</div>
			)}
			{listElement.length > 0 && (
				<div className='flex w-full justify-center mt-3'>
					<TableCustom
						data={listElement}
						columns={ColumnsDevice(removeElementList)}
						density='comfortable'
						header={{
							background: 'rgb(190 190 190)',
							fontSize: '18px',
							fontWeight: 'bold',
						}}
						toolbarClass={{ background: 'rgb(190 190 190)' }}
						body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
						footer={{ background: 'rgb(190 190 190)' }}
						card={{
							boxShadow: `1px 1px 8px 0px #00000046`,
							borderRadius: '0.75rem',
						}}
					/>
				</div>
			)}
		</>
	)
}

export default AddElementElectric
