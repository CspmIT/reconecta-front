import React from 'react'
import MapPrueba from '../components/MapPrueba/MapPrueba'
import { Card } from '@mui/material'

function Map() {
    return (
        <Card className='h-[75vh] w-full !max-w-[93vw] !shadow-md !shadow-black/40 !rounded-xl'>
            <MapPrueba />
        </Card>
    )
}

export default Map
