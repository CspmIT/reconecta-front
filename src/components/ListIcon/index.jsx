import { BsFillMenuButtonWideFill } from 'react-icons/bs'
import { FaCogs, FaFile, FaMapMarkedAlt, FaProjectDiagram, FaThList } from 'react-icons/fa'
import { MdContentPaste, MdNotificationsActive } from 'react-icons/md'
import { RiAlertFill, RiDashboardFill } from 'react-icons/ri'
import { GrConfigure } from "react-icons/gr";

const ListIcon = () => [
	{ title: 'Mapa', name: 'FaMapMarkedAlt', icon: <FaMapMarkedAlt className=' text-3xl' /> },
	{ title: 'Diagrama', name: 'FaProjectDiagram', icon: <FaProjectDiagram className=' text-3xl' /> },
	{ title: 'Bitacora', name: 'MdContentPaste', icon: <MdContentPaste className=' text-3xl' /> },
	{ title: 'Configuración', name: 'FaCogs', icon: <FaCogs className=' text-3xl' /> },
	{ title: 'Access', name: 'BsFillMenuButtonWideFill', icon: <BsFillMenuButtonWideFill className=' text-3xl' /> },
	{ title: 'Notificación', name: 'FaThList', icon: <FaThList className=' text-3xl' /> },
	{ title: 'Dashboard', name: 'RiDashboardFill', icon: <RiDashboardFill className=' text-3xl' /> },
	{ title: 'Alerta', name: 'RiAlertFill', icon: <RiAlertFill className=' text-3xl' /> },
	{ title: 'Pagina', name: 'FaFile', icon: <FaFile className=' text-3xl' /> },
	{ title: 'Hardware', name: 'GrConfigure', icon: <GrConfigure className=' text-3xl' /> }
]

export default ListIcon
