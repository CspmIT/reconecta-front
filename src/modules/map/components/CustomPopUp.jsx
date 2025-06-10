import { Modal } from "@mui/material"
import { FaCircle } from "react-icons/fa"
import { MainContext } from "../../../context/MainContext"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import SubstationRuralBoard from "../../substationRural/views"
import Board from "../../recloser/views"
import BoardMeter from "../../meter/views"
import AnalyzerBoard from "../../analyzer/board/views"

function CustomPopUpRecloser({ content, open, handleClose }) {
	const { tabs, setTabs, setTabCurrent } = useContext(MainContext)
	const recloserStyle = [
		{ color: 'text-green-500', text: 'Abierto' },
		{ color: 'text-red-500', text: 'Cerrado' },
		{ color: 'text-yellow-500', text: 'Sin señal' }
	]

	const navigate = useNavigate()
	const typeEquipment = (key) => {
		let component
		switch (key) {
			case 0:
				component = <SubstationRuralBoard />
				break
			case 1:
				component = <Board />
				break
			case 2:
				component = <BoardMeter />
				break
			case 3:
				component = <AnalyzerBoard />
				break
			default:
				break
		}
		return component
	}

	const handleClick = async (data) => {
		try {
			const name = data.elementType === 3 ? `${content.info.name} - ${content.info.number}` :
				`${content.info.name} - ${data.observation ? data.observation : `${data.equipmentmodels.name} ${data.equipmentmodels.brand}`}`
			const existingTabIndex = tabs.findIndex(
				(tab) => tab.id === data.id && tab.typeEquipment === data.equipmentmodels.type
			)
			if (existingTabIndex !== -1) {
				setTabCurrent(existingTabIndex)
			} else {
				setTabs((prevTabs) => [
					...prevTabs,
					{
						name,
						id: data.id,
						equipmentId: data.equipmentmodels.id,
						typeEquipment: data.equipmentmodels.type,
						clients: data.clients,
						link: '/board',
						component: typeEquipment(data.equipmentmodels.type),
					},
				])
				setTabCurrent(tabs.length)
			}
			navigate('/tabs')
		} catch (e) {
			console.error(e)
		}
	}
	return (
		<div className='rounded-lg p-0 min-w-36 border-2 border-gray-900 overflow-hidden'>
			<div className='bg-slate-400 border-b-2 border-gray-900 p-1 row'>
				<p className='namePopUp !m-0 text-md text-white font-semibold'>{content.info.name || content.number}</p>
			</div>
			<div className='bg-slate-800 text-white pl-1 row items-center'>
				<p className='!m-0 font-bold !mr'>Equipos instalados: {content.equipments.length}</p>
			</div>
			<Modal open={open} onClose={handleClose} className="flex items-center justify-center">
				<div className="bg-slate-800 text-white p-6 rounded-xl w-full max-w-4xl shadow-xl">
					<div className="mb-6">
						<h4 className="text-center font-bold text-2xl">{content.info.name || content.number}</h4>
						<h5 className="text-center text-xl text-slate-300">{content.info.number}</h5>
					</div>

					<div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-slate-600 text-sm text-slate-400 font-semibold uppercase tracking-wider">
						<div className="col-span-3">Nº equipo</div>
						<div className="col-span-7">Nombre</div>
						<div className="col-span-2 text-center">Estado</div>
					</div>

					{content.equipments.map((equipment, index) => (
						<div
							key={index}
							className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-slate-700 transition-colors duration-200 rounded-lg hover:cursor-pointer"
							title="Ver detalles"
							onClick={() => handleClick(equipment)}
						>
							<div className="col-span-3 font-medium">Equipo {index + 1}</div>
							<div className="col-span-7">{equipment.observation}</div>
							<div className="col-span-2 flex justify-center items-center">
								{equipment?.equipmentmodels?.type === 1 && (
									<div className="flex items-center">
										<FaCircle
											className={`${recloserStyle[equipment.influxData['d/c']?.[0]?.value]?.color || "text-gray-500"
												} text-lg mr-2`}
										/>
										{recloserStyle[equipment.influxData['d/c']?.[0]?.value]?.text || "Sin señal"}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</Modal>
		</div>
	)
}

export default CustomPopUpRecloser
