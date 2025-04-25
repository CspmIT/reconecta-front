import { Skeleton } from '@mui/material'
import React from 'react'

const LoadingTable = () => {
  return (
    <div className='w-full'>
      <Skeleton animation="wave" height={50} variant='rounded' />
      <br />
      <Skeleton animation="pulse" height={500} variant='rounded' />
    </div>
  )
}

export default LoadingTable