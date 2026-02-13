import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { backend } from "../../../utils/routes/app.routes"
import { useNavigate } from "react-router-dom"
import { request } from "../../../utils/js/request"
import CardCustom from "../../../components/CardCustom"
import { Button, MenuItem, TextField } from "@mui/material"
import Swal from "sweetalert2"

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
        // setLoading(true)
        const typeNumber = models.find(model => model.id === formData.id_version).type
        switch (typeNumber) {
            case 1:
                formData.type_device = 'Reconectador'
                break
            case 2:
                formData.type_device = 'Medidor'
                break
            case 3:
                formData.type_device = 'Analizador'
                break
        }
        formData.status = 1
        try {
            await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/ConfigNotify`, 'POST', formData)
            Swal.fire({
                icon: 'success',
                title: 'Configuración guardada correctamente',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
            })
            navigate('/config/notifications')
        } catch (e) {
            console.error(e)
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
                    <div className='w-full flex justify-center gap-5 flex-wrap'>
                        <TextField className="w-1/6" label="Modelo" select {...register("id_version")} required >
                            {models.map((model) => (
                                <MenuItem key={model.id} value={model.id}>
                                    {`${model.name} ${model.brand}`}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField className="w-1/6" label="Nro Evento Influx" type="number" {...register("id_event_influx")} required />
                        <TextField className="w-1/6" label="Database ID" multiline type="text" {...register("id_database")} required />
                        <TextField className="w-2/6" label="Evento" type="text" multiline {...register("name")} />
                        <TextField className="w-2/6" label="Descripción" type="text" multiline {...register("description")} />
                        <TextField className="w-1/6" label="Prioridad" select {...register("priority")} required >
                            <MenuItem value="1">Alta</MenuItem>
                            <MenuItem value="2">Baja</MenuItem>
                            <MenuItem value="3">Sin prioridad</MenuItem>
                        </TextField>
                        <TextField className="w-1/6" label="Tipo de variable" select {...register("type_var")} required >
                            <MenuItem value="Log">Log</MenuItem>
                            <MenuItem value="Output">Output</MenuItem>
                            <MenuItem value="Event">Event</MenuItem>
                        </TextField>
                        <div className="w-1/12 flex items-center gap-x-2">
                            <input className="w-5 h-5" type="checkbox" {...register("flash_screen")} />
                            <b className="text-md">Destello en pantalla</b>
                        </div>
                        <div className="w-1/12 flex items-center gap-x-2">
                            <input className="w-5 h-5" type="checkbox" {...register("alarm")} />
                            <b className="text-md">Notificación</b>
                        </div>
                    </div>
                    <div className='w-full flex justify-center mt-5'>
                        <Button type='submit' variant='contained' disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </CardCustom>
        </div>
    )
}

export default AddConfigNotification