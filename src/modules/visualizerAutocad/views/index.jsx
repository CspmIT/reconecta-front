// import '../utils/Viewer.css'
// import '../utils/viewer'
// import '../utils/main'
const ForgeViewer = () => {
	return (
		<div className='bg-gray-500 p-5 w-11/12 relative'>
			<div id='header'>
				<select name='models' id='models'></select>
				<button id='upload' title='Upload New Model'>
					Upload
				</button>
				<input style={{ display: 'none' }} type='file' id='input' />
			</div>
			<div id='preview'></div>
			<div id='overlay'></div>
		</div>
	)
}

export default ForgeViewer
