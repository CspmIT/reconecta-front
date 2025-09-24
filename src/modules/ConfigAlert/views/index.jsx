import React from 'react'
import CardCustom from '../../../components/CardCustom'
import { TextField } from '@mui/material'
import { useForm } from 'react-hook-form'

const ConfigAlert = () => {
    const {
        register,
        setValue,
        clearErrors,
        formState: { errors },
        handleSubmit,
    } = useForm()
    const onSubmit = async (data) => {

    }
    return (
        <div className={'w-full flex justify-center items-center rounded-md text-black'}>
            <CardCustom className={'w-full rounded-md text-black flex justify-center flex-wrap gap-y-3'}>
                <div className='w-full flex-row gap-3'>
                    <div className='mt-3'>
                        <p className='w-full text-center text-2xl'>Configurar alerta de eventos</p>
                    </div>
                </div>
                <form id='formAbmRecloser' onSubmit={handleSubmit(onSubmit)} className='w-full p-7'>
                    <div className='w-full gap-3 flex'>
                        <div className='w-full md:w-1/3 '>
                            <TextField
                                className='w-full'
                                label='Nombre del bot'
                                name='username'
                                {...register('username', { required: 'Campo obligatorio' })}
                            />
                            {errors.username && <p className='text-red-500'>{errors.username.message}</p>}
                        </div>
                        <div className='w-full md:w-1/3 '>
                            <TextField
                                className='w-full'
                                label='Webhook'
                                name='webhook'
                                {...register('webhook', { required: 'Campo obligatorio' })}
                            />
                            {errors.webhook && <p className='text-red-500'>{errors.webhook.message}</p>}
                        </div>
                    </div>
                </form>
            </CardCustom>
        </div>
    )
}

export default ConfigAlert