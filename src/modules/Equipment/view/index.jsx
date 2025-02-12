import React from 'react'
import { useParams } from 'react-router-dom'

const Equipment = () => {
    const { id } = useParams()
    return (
        <div>Equipment</div>
    )
}

export default Equipment