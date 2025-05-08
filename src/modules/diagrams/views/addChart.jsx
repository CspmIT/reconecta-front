import { Card, MenuItem, TextField } from "@mui/material"
import { useState } from "react"
import SunburstGenerate from "../components/Sunburst"


const AddChart = () => {
  const [typeGraph, setTypeGraph] = useState(false)
  return (
    <Card className='w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'>
      <div className='w-full md:p-5'>
        <h1 className='text-2xl mb-3'>Generar gráfico</h1>
      </div>
      <div className='w-full flex flex-wrap justify-center'>
        <TextField name="type" label="Tipo de gráfico" className='w-full md:w-1/4 p-2' select onChange={(e) => setTypeGraph(e.target.value)}>
          <MenuItem value='0' disabled>Seleccione un tipo</MenuItem>
          <MenuItem value='1'>Rayo de sol</MenuItem>
        </TextField>
      </div>
      {typeGraph === '1' && <SunburstGenerate />}
    </Card>
  )
}

export default AddChart