import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'

const CustomSwitch = styled((props) => <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />)(
	({ width = 62, height = 34, onColor = '#2196f3', offColor = '#ccc' }) => ({
		width: width,
		height: height,
		padding: 0,
		'& .MuiSwitch-switchBase': {
			padding: 0,
			margin: 2,
			transitionDuration: '300ms',
			'&.Mui-checked': {
				transform: `translateX(${width - height}px)`,
				color: '#fff',
				'& + .MuiSwitch-track': {
					backgroundColor: onColor,
					opacity: 1,
					border: 0,
				},
				'&.Mui-disabled + .MuiSwitch-track': {
					opacity: 0.5,
				},
			},
			'&.Mui-focusVisible .MuiSwitch-thumb': {
				color: onColor,
				border: '6px solid #fff',
			},
			'&.Mui-disabled .MuiSwitch-thumb': {
				color: '#999',
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				opacity: 0.3,
			},
		},
		'& .MuiSwitch-thumb': {
			boxSizing: 'border-box',
			width: height - 5,
			height: height - 5,
		},
		'& .MuiSwitch-track': {
			borderRadius: width / 2,
			backgroundColor: offColor,
			opacity: 1,
			transition: 'background-color 500ms',
		},
	})
)

export default CustomSwitch
