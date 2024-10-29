import { MenuItem, TextField, Select } from '@mui/material'
import ListIcon from '../../../../../components/ListIcon'
import '../utils/css/styles.css'
import { useEffect, useState } from 'react'

function FormMenu({ setIconSelect }) {
	const [dataForm, setDataForm] = useState({ name: '', link: '', icon: '' })
	const icons = ListIcon()

	const changeValue = (e) => {
		setDataForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	useEffect(() => {
		setIconSelect(dataForm)
	}, [dataForm])

	return (
		<div className='flex flex-col gap-5 mt-4'>
			<TextField type='text' label='Nombre' id='name' name='name' onChange={changeValue} className='w-full' />
			<TextField type='text' label='Link' id='link' name='link' onChange={changeValue} className='w-full' />
			<TextField
				label='Iconos'
				id='icono-select'
				name='icon'
				className='w-full'
				select
				SelectProps={{
					value: dataForm.icon,
					onChange: changeValue,
					renderValue: (selected) => {
						const selectedItem = icons.find((item) => item.name === selected)
						return (
							<div className='flex gap-3 items-center'>
								{selectedItem ? (
									<>
										{selectedItem.icon}
										<span>{selectedItem.title.toUpperCase()}</span>
									</>
								) : (
									<em>Iconos</em>
								)}
							</div>
						)
					},
				}}
			>
				<MenuItem value=''>
					<em>Iconos</em>
				</MenuItem>
				{icons.map((item, index) => (
					<MenuItem key={index} value={item.name}>
						<div className='flex gap-3 items-center'>
							{item.icon} <span>{item.title.toUpperCase()}</span>
						</div>
					</MenuItem>
				))}
			</TextField>
		</div>
	)
}

export default FormMenu
