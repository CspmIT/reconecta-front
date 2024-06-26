import Grafs from '../components/Grafs'
import TableRecloser from '../components/TableRecloser'

const Home = () => {
	return (
		<div className='flex flex-col w-full pr-9 pl-4 pt-4'>
			<div className='row gap-3 mb-5 '>
				<Grafs />
			</div>
			<TableRecloser />
		</div>
	)
}

export default Home
