import Grafs from '../components/Grafs'
import TableRecloser from '../components/TableRecloser'

const Home = () => {
	return (
		<div className='flex flex-col w-full pt-4'>
			<div className='row gap-3 mb-5 px-3'>
				<Grafs />
			</div>
			<TableRecloser />
		</div>
	)
}

export default Home
