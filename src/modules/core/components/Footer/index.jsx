function Footer() {
	const year = new Date().getFullYear()
	return (
		<div className='absolute bottom-0 !h-16 flex justify-center items-center w-full z-50 bg-primary'>
			<h1>Copyright © IT & Development - COOPMORTEROS {year}</h1>
		</div>
	)
}

export default Footer
