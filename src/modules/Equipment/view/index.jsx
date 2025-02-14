import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CardCustom from '../../../components/CardCustom'
import { backend } from '../../../utils/routes/app.routes'
import { request } from '../../../utils/js/request'
import { Button, MenuItem, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import MapSelect from '../components/Map'
import Swal from 'sweetalert2'

const Equipment = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [nodes, setNodes] = useState([])
    const [models, setModels] = useState([])
    const [element, setElement] = useState(null)
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            id: null,
            serial: '',
            id_model: '',
            observation: '',
            configuration: '',
            id_element: ''
        }
    })
    const [loading, setLoading] = useState(false)

    const getData = async () => {
        const response = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/Elements`, 'GET')
        setNodes(response.data)
        const brands = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/ElementsModel`, 'GET')
        setModels(brands.data)
        if (!id) return
        setLoading(true)
        try {
            const { data } = await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/Equipment/${id}`, 'GET')
            if (data.length > 0) {
                if (data[0]?.elements?.type === 0) {
                    setElement(null)
                } else {
                    setElement(data[0]?.elements)
                }
                reset({
                    id: data[0]?.id || null,
                    serial: data[0]?.serial || '',
                    id_model: data[0]?.equipmentmodels?.id || '',
                    observation: data[0]?.observation || '',
                    configuration: data[0]?.configuration || '',
                    id_element: data[0]?.id_element || ''
                })
            }
        } catch (error) {
            console.error('Error al obtener datos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChangeElement = async (id) => {
        const filterElement = nodes.filter(node => node.id === id)
        if (filterElement[0].type === 0) {
            setElement(null)
            return
        }
        setElement(filterElement[0])
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
            navigate('/tabs')
        } catch (error) {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [id])

    return (
        <div className='w-full flex justify-center items-center rounded-md text-black'>
            <CardCustom className='w-full rounded-md text-black'>
                <div className='mt-3'>
                    <p className='w-full text-center text-2xl'>
                        {id ? 'Editar equipo' : 'Nuevo equipo'}
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-wrap p-7'>
                    <div className='w-full flex justify-center gap-x-5'>

                        <Controller
                            name="serial"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField label='Serial' className='w-1/6' type='text' {...field}
                                    InputLabelProps={{ shrink: !!field.value }} />
                            )}
                        />

                        <Controller
                            name="id_model"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    label='Modelo'
                                    className='w-1/6'
                                    select
                                    {...field}
                                    InputLabelProps={{ shrink: true }}
                                >
                                    {models.map((mod) => (
                                        <MenuItem key={mod.id} value={mod.id}>{mod.name} {mod.brand}</MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Controller
                            name="observation"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField label='Observación' className='w-1/4' type='text' {...field}
                                    InputLabelProps={{ shrink: !!field.value }} />
                            )}
                        />

                        <Controller
                            name="configuration"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    label='Configuración'
                                    className='w-1/6'
                                    select
                                    {...field}
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <MenuItem value="">Seleccionar configuración</MenuItem>
                                    <MenuItem value="1">Estandar</MenuItem>
                                    <MenuItem value="2">Especial</MenuItem>
                                </TextField>
                            )}
                        />

                        <Controller
                            name="id_element"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    label='Nodo de infraestructura'
                                    className='w-1/6'
                                    select
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handleChangeElement(e.target.value)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                >
                                    {nodes.map((node) => (
                                        <MenuItem key={node.id} value={node.id}>{node.name}</MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                    </div>
                    {element && (
                        <div className='w-full h-96 flex justify-center mt-5'>
                            <div className='w-3/4 border-4 border-gray-500 rounded-md'>
                                <MapSelect element={element} />
                            </div>
                        </div>
                    )}
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

export default Equipment