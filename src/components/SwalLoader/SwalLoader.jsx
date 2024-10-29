import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import LoaderComponent from '../Loader'

async function SwalLoader() {
	const MySwal = withReactContent(Swal)
	await MySwal.fire({
		html: (
			<div className='p-5'>
				<LoaderComponent />
			</div>
		),
		focusConfirm: false,
		showCancelButton: false,
		showCloseButton: false,
		showConfirmButton: false,
		allowOutsideClick: false,
	})
}

export default SwalLoader
