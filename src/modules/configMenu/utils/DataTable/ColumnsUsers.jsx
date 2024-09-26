import { Add, Circle, Edit } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useState } from 'react'
import { FaKey } from 'react-icons/fa'
import Swal from 'sweetalert2'

const profile = {
	1: 'Moderador',
	2: 'Lector',
	3: 'Operador',
	4: 'Super Admin',
}
export const ColumnsUser = (editUser) => [
	{
		header: 'Nombre',
		accessorKey: 'first_name',
		Cell: ({ row }) => {
			return <p className='m-0 p-0 ml-2 text-base'>{`${row.original?.first_name} ${row.original?.last_name}`}</p>
		},
		size: 300,
	},
	{
		header: 'Email',
		accessorKey: 'email',
	},
	{
		header: 'Perfil',
		accessorKey: 'profile',
		Cell: ({ row }) => {
			return <p className='m-0 p-0 ml-2 text-base'>{`${profile[row.original?.profile]}`}</p>
		},
	},
	{
		header: 'Clave de Operación',
		accessorKey: 'password',
		size: 50,
		Cell: ({ row }) => {
			const [editing, setEditing] = useState(false)
			const [password, setPassword] = useState(row.original?.password || '')

			const swalNewPassword = async (id) => {
				Swal.fire({
					title: 'Crear nueva contraseña',
					input: 'password',
					inputAttributes: {
						autocapitalize: 'off',
						autocomplete: 'off',
						placeholder: 'Ingrese su contraseña',
						form: {
							autocomplete: 'off',
						},
					},
					inputLabel: 'Ingresa la nueva contraseña',
					inputPlaceholder: 'Nueva contraseña',
					showCancelButton: true,
					confirmButtonText: 'Guardar',
					preConfirm: (password) => {
						if (!password) {
							Swal.showValidationMessage('La contraseña no puede estar vacía')
						} else {
							// Lógica para guardar la contraseña en la base de datos o estado de la aplicación.
							setEditing(false)
							Swal.fire({
								title: 'Perfecto!',
								text: 'Se guardo correctamente',
								icon: 'success',
							})
						}
					},
					didOpen: () => {
						const inputField = Swal.getInput()
						inputField.setAttribute('autocomplete', 'new-password')
					},
				})
			}

			return (
				<div className='flex items-center justify-end'>
					{editing ? (
						<div className='flex items-center'>
							<input
								type='text'
								value={password}
								disabled={true}
								onChange={(e) => setPassword(e.target.value)}
								className='border p-1 rounded'
								placeholder='Nueva contraseña'
							/>
							<IconButton onClick={swalNewPassword} className='!text-black !shadow-md'>
								<Add />
							</IconButton>
						</div>
					) : (
						<div className='flex items-center'>
							<p className='m-0 p-0 mr-5 text-base'>{password ? '••••••••' : ''}</p>
							<IconButton
								onClick={password ? () => setEditing(true) : () => swalNewPassword()}
								className='!text-black !shadow-md'
							>
								{password ? <FaKey /> : <Add />}
							</IconButton>
						</div>
					)}
				</div>
			)
		},
	},

	{
		header: 'Estado',
		accessorKey: 'status',
		Cell: ({ row }) => {
			return (
				<div className='flex items-center w-full'>
					<Circle color={row.original?.status > 0 ? 'success' : 'error'} />
					<p className='m-0 p-0 ml-2 text-base'>{`${
						row.original?.status > 0 ? 'Habilitado' : 'Deshabilitado'
					}`}</p>
				</div>
			)
		},
	},
	{
		header: '',
		accessorKey: 'btn-dashboard',
		size: 10,
		enableSorting: false,
		enableColumnFilter: false,
		enableClickToCopy: false,
		Cell: ({ row }) => {
			return (
				<IconButton
					onClick={() => editUser(row.original)}
					className=' !bg-[#ffbf1e] hover:!bg-[#ffde89] !text-black !shadow-md'
				>
					<Edit />
				</IconButton>
			)
		},
	},
]
