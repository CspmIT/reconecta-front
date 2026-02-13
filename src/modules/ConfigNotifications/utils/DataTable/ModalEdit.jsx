import { Close } from "@mui/icons-material"
import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { FaPen } from "react-icons/fa"
import { request } from "../../../../utils/js/request"
import { backend } from "../../../../utils/routes/app.routes"
import Swal from "sweetalert2"


const ModalEdit = ({ data, setValueName }) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(data.name)
    const handleChange = (event) => {
        setValue(event.target.value)
    }
    const handleSubmit = async () => {
        try {
            const formData = {
                id: data.id,
                name: value,
            }
            await request(`${backend[`${import.meta.env.VITE_APP_NAME}`]}/ConfigNotify`, 'POST', formData)
            setValueName(data.id, value)
            setOpen(false)
            Swal.fire({
                icon: 'success',
                title: 'Configuración editada correctamente',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
            })
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Error al editar la configuración',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
            })
        }
    }
    return (
        <>
            <IconButton onClick={() => setOpen(true)}>
                <FaPen />
            </IconButton>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby='modal-title'
                aria-describedby='modal-description'
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        color: 'black',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <IconButton onClick={() => setOpen(false)} className='!absolute !right-0 top-0'>
                        <Close />
                    </IconButton>
                    <Typography id='modal-title' variant='h6' component='h2' className="pb-5">
                        Modificar evento
                    </Typography>
                    <div className="flex flex-col gap-5">
                        <TextField variant="outlined" defaultValue={value} fullWidth multiline minRows={4} onChange={handleChange} />
                        <Button variant="contained" className="mt-5 text-center" onClick={handleSubmit}>
                            Guardar
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default ModalEdit