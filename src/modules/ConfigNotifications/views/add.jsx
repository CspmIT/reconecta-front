import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { backend } from "../../../utils/routes/app.routes"
import { useNavigate } from "react-router-dom"
import { request } from "../../../utils/js/request"
import CardCustom from "../../../components/CardCustom"
import { MenuItem, TextField } from "@mui/material"

const AddConfigNotification = () => {
    const navigate = useNavigate()
    const { control, handleSubmit, register } = useForm()
    const [models, setModels] = useState([])
    const [loading, setLoading] = useState(false)

    const getModels = async () => {
        try {
            const brands = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/ElementsModel`, 'GET')
            setModels(brands.data)
        } catch (e) {
            console.error(e)
        }
    }
    const onSubmit = async (formData) => {
        setLoading(true)
        try {
            const method = id ? 'PATCH' : 'POST'
            const url = `${backend[`${import.meta.env.VITE_APP_NAME}`]}/Equipment`

            await request(url, method, formData)
            setLoading(false)
            Swal.fire({
                icon: 'success',
                title: 'Guardado',
                text: 'Equipo guardado correctamente',
            })
            navigate('/config/notifications')
        } catch (error) {
            setLoading(false)
        }
    }
    useEffect(() => {
        getModels()
    }, [])
    return (
        <div className='w-full flex justify-center items-center rounded-md text-black'>
            <CardCustom className='w-full rounded-md text-black'>
                <div className='mt-3'>
                    <p className='w-full text-center text-2xl'>
                        Nueva configuración
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-wrap p-7'>
                    <div className='w-full flex justify-center gap-x-5'>
                        <TextField className="w-1/6" label="Modelo" select {...register("id_version")}>
                            {models.map((model) => (
                                <MenuItem key={model.id} value={model.id}>
                                    {`${model.name} ${model.brand}`}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField className="w-1/6" label="Nro Evento Influx" type="number" {...register("id_event_influx")} />
                        <TextField className="w-1/6" label="Database ID" type="text" {...register("id_database")} />
                        <TextField className="w-1/6" label="Evento" type="text" multiline {...register("name")} />
                        <TextField className="w-1/6" label="Descripción" type="text" multiline {...register("description")} />
                        <TextField className="w-1/6" label="Prioridad" select {...register("priority")}>
                            <MenuItem value="1">Alta</MenuItem>
                            <MenuItem value="2">Baja</MenuItem>
                            <MenuItem value="3">Sin prioridad</MenuItem>
                        </TextField>

                    </div>
                </form>
            </CardCustom>
        </div>
    )
}

export default AddConfigNotification