import { useEffect, useRef, useState } from 'react'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { removeData } from '../../../../storage/cookies-store'

const DropdownImage = ({ props }) => {
	const [isDropdownOpen, setDropdownOpen] = useState(false)
	const dropdownRef = useRef(null) // Referencia al dropdown
	const navigator = useNavigate()
	const toggleDropdown = () => {
		setDropdownOpen(!isDropdownOpen)
	}

	const handleLogout = async () => {
		localStorage.clear()
		await removeData('token')
		navigator('/')
	}

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false)
			}
		}
		// Agregar el escuchador de eventos al montar el componente
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			// Limpiar el escuchador de eventos al desmontar el componente
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div className='relative inline-block text-left ml-3' ref={dropdownRef}>
			<div>
				<button
					type='button'
					className='p-2 relative flex rounded-full bg-transparent shadow-none text-sm '
					id='user-menu-button'
					aria-expanded='false'
					aria-haspopup='true'
					onClick={toggleDropdown}
				>
					<img
						className='h-8 w-8 rounded-full'
						src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
						alt='imagen de perfil'
					/>
				</button>
			</div>
			{isDropdownOpen && (
				<div
					className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-black shadow-lg  focus:outline-none'
					role='menu'
					aria-orientation='vertical'
					aria-labelledby='user-menu-button'
					tabIndex='-1'
				>
					<div className='py-1' role='none'>
						<Link
							to={'/profile'}
							className='px-2 py-1 flex items-center w-full md:w-auto hover:bg-gray-200 pl-4 dark:text-white dark:hover:bg-gray-700'
						>
							<FaUser className='mr-2' /> Perfil
						</Link>
						<a
							href='#'
							onClick={() => handleLogout()}
							className='px-2 py-1 flex items-center w-full md:w-auto hover:bg-gray-200 pl-4 dark:text-white dark:hover:bg-gray-700'
							role='menuitem'
							tabIndex='-1'
							id='user-menu-item-1'
						>
							<FaSignOutAlt className='mr-2' /> Cerrar Sesión
						</a>
					</div>
				</div>
			)}
		</div>
	)
}

export default DropdownImage
