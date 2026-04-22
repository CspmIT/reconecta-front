import React, { useState } from 'react'
import CardCustom from '../../../components/CardCustom'
import BluetoothConnector from '../components/BluetoothConnector'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Fab, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, TextField, Typography } from '@mui/material'
import { FaServer, FaNetworkWired, FaEthernet, FaWifi } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { MdSaveAlt, MdSignalCellularAlt } from "react-icons/md";
import { Delete, Edit } from '@mui/icons-material';
import Swal from 'sweetalert2';


const ConfigHardware = () => {
    const [ethernetEnabled, setEthernetEnabled] = useState(false);
    const [wifiEnabled, setWifiEnabled] = useState(false);
    const [gprsEnabled, setGprsEnabled] = useState(false);
    const [ethernet, setEthernet] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const isCustomSelected = selectedOption === "Custom";
    const [wifiEditable, setWifiEditable] = useState([false, false, false]);

    const toggleEditable = (index) => {
        const updated = [...wifiEditable];
        updated[index] = !updated[index];
        setWifiEditable(updated);
    };

    const handleGuardarWifi = () => {
        // Acá iría la lógica de guardado (si hace falta)
        setWifiEditable([false, false, false]);

        Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: 'Los cambios se han guardado correctamente.',
            confirmButtonColor: '#10B981',
            timer: 2000,
            showConfirmButton: false
        });
    };


    return (
        <>
            <CardCustom className={'w-full h-full flex flex-col items-center justify-center text-black dark:text-white relative p-3 rounded-md'} >
                <h1 className='text-2xl pt-2'>Configuración Multivac</h1>
                <p>En desarollo...</p>
                {/* <BluetoothConnector />

                <Accordion className="w-full mb-3 !rounded-md !shadow-md dark:!bg-gray-600 !bg-gray-300">
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <div className="flex items-center gap-2">
                            <FaNetworkWired className="text-3xl" />
                            <Typography component="span" className="!text-lg font-semibold ps-2">
                                Networking
                            </Typography>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails className="bg-gray-100 dark:bg-gray-500 p-3 rounded-b-md">
                        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Checkbox checked={ethernetEnabled} onChange={() => setEthernetEnabled(!ethernetEnabled)} color="success" />
                                        <Typography component="span" className="!text-lg font-semibold">
                                            Ethernet
                                        </Typography>
                                        <FaEthernet className='text-xl' />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FormControl
                                            sx={{
                                                minWidth: 120,
                                                "& .MuiInputBase-root.Mui-disabled": {
                                                    backgroundColor: "#e5e7eb",
                                                    color: "#9CA3AF"
                                                }
                                            }}
                                            size="small"
                                            className="!bg-white dark:!bg-gray-600 !text-black"
                                            disabled={!ethernetEnabled}
                                        >
                                            <InputLabel>Tipo</InputLabel>
                                            <Select
                                                value={ethernet}
                                                onChange={(e) => setEthernet(e.target.value)}
                                                label="Tipo"
                                            >
                                                <MenuItem value={1}>Static IP</MenuItem>
                                                <MenuItem value={2}>DHCP</MenuItem>
                                                <MenuItem value={3}>Fallover</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                <TextField
                                    label="Local IP"
                                    size="small"
                                    disabled={!ethernetEnabled}
                                    className="!bg-white dark:!bg-gray-600"
                                    sx={{
                                        "& .MuiInputBase-root.Mui-disabled": {
                                            backgroundColor: "#e5e7eb",
                                            color: "#9CA3AF"
                                        }
                                    }}
                                />
                                <TextField
                                    label="Subnet Mask"
                                    size="small"
                                    disabled={!ethernetEnabled}
                                    className="!bg-white dark:!bg-gray-600"
                                    sx={{
                                        "& .MuiInputBase-root.Mui-disabled": {
                                            backgroundColor: "#e5e7eb",
                                            color: "#9CA3AF"
                                        }
                                    }}
                                />
                                <TextField
                                    label="Gateway"
                                    size="small"
                                    disabled={!ethernetEnabled}
                                    className="!bg-white dark:!bg-gray-600"
                                    sx={{
                                        "& .MuiInputBase-root.Mui-disabled": {
                                            backgroundColor: "#e5e7eb",
                                            color: "#9CA3AF"
                                        }
                                    }}
                                />

                                <div className='flex items-center justify-center'>
                                    <Fab variant="extended" size="small" color="success" className='!w-auto !mt-2 !px-5' disabled={!ethernetEnabled}>
                                        <MdSaveAlt className="text-xl mr-1" />
                                        Guardar
                                    </Fab>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox checked={wifiEnabled} onChange={() => setWifiEnabled(!wifiEnabled)} color="success" />
                                    <Typography component="span" className="!text-lg font-semibold">
                                        Wi-Fi
                                    </Typography>
                                    <FaWifi className='text-xl' />
                                </div>
                                {[1, 2, 3].map((num) => (
                                    <div key={num} className="flex items-center gap-2">
                                        <TextField
                                            label={`Red ${num} SSID`}
                                            size="small"
                                            disabled={!wifiEnabled || !wifiEditable[num - 1]}
                                            className="w-[55%] !bg-white dark:!bg-gray-600"
                                            sx={{
                                                "& .MuiInputBase-root.Mui-disabled": {
                                                    backgroundColor: "#e5e7eb",
                                                    color: "#9CA3AF"
                                                }
                                            }}
                                            inputProps={{ autoComplete: 'off' }}
                                        />
                                        <TextField
                                            label={`Red ${num} Pass`}
                                            type='password'
                                            size="small"
                                            disabled={!wifiEnabled || !wifiEditable[num - 1]}
                                            className="!bg-white dark:!bg-gray-600"
                                            sx={{
                                                "& .MuiInputBase-root.Mui-disabled": {
                                                    backgroundColor: "#e5e7eb",
                                                    color: "#9CA3AF"
                                                }
                                            }}
                                            inputProps={{ autoComplete: 'new-password' }}
                                        />
                                        <Edit
                                            onClick={() => toggleEditable(num - 1)}
                                            className={`
                                                text-xl 
                                                ${!wifiEnabled ? 'text-gray-400 pointer-events-none cursor-default' : 'text-black cursor-pointer hover:text-slate-700'}
                                            `}
                                        />
                                        <Delete
                                            className={`
                                                text-xl 
                                                ${!wifiEnabled ? 'text-gray-400 pointer-events-none cursor-default' : 'text-black cursor-pointer hover:text-slate-700'}
                                            `}
                                        />
                                    </div>
                                ))}
                                <div className='flex items-center justify-center'>
                                    <Fab
                                        variant="extended"
                                        size="small"
                                        color="success"
                                        className='!w-auto !mt-2 !px-5'
                                        onClick={handleGuardarWifi}
                                        disabled={!wifiEnabled}>
                                        <MdSaveAlt className="text-xl mr-1" />
                                        Guardar
                                    </Fab>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox checked={gprsEnabled} onChange={() => setGprsEnabled(!gprsEnabled)} color="success" />
                                    <Typography component="span" className="!text-lg font-semibold">
                                        Móvil GPRS
                                    </Typography>
                                    <MdSignalCellularAlt className='text-xl' />
                                </div>
                            </div>

                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion className="w-full mb-3 !rounded-md !shadow-md dark:!bg-gray-600 !bg-gray-300">
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <div className="flex items-center gap-2">
                            <FaServer className="text-3xl" />
                            <Typography component="span" className="!text-lg font-semibold ps-2">
                                Server MQTT
                            </Typography>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails className="bg-gray-100 dark:bg-gray-500 p-3 rounded-b-md">
                        <div className="flex items-center gap-2 justify-center">
                            <Typography component="span" className="!text-md font-semibold">
                                Habilitar rutas públicas
                            </Typography>
                            <Switch color="success" />
                        </div>
                        <hr className="m-2" />

                        <div className="flex flex-col justify-center md:flex-row md:items-center gap-4">
                            <RadioGroup
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(e.target.value)}
                                className="flex flex-col items-start gap-1"
                            >
                                {[
                                    "IoT agua interno",
                                    "Energía interno",
                                    "Energía externo",
                                    "IoT + Agua externo",
                                    "Testing / Pruebas",
                                    "Custom"
                                ].map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={<Radio color="success" />}
                                        label={option}
                                    />
                                ))}
                            </RadioGroup>

                            {isCustomSelected && (
                                <div className="flex flex-col items-center gap-2 w-full md:w-auto">
                                    <TextField label="Usuario" size="small" className="!bg-white dark:!bg-gray-600 w-full" inputProps={{ autoComplete: 'off' }} />
                                    <TextField label="Contraseña" type='password' size="small" className="!bg-white dark:!bg-gray-600 w-full" inputProps={{ autoComplete: 'new-password' }} />

                                    {[1, 2, 3].map((index) => (
                                        <div key={index} className="w-full flex justify-center gap-2">
                                            <TextField label="IP" size="small" className="!bg-white dark:!bg-gray-600 w-full md:w-auto" />
                                            <TextField label="Port" size="small" className="!bg-white dark:!bg-gray-600 w-full md:w-auto" />
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                        <div className='flex items-center justify-center'>
                            <Fab variant="extended" size="small" color="success" className='!w-auto !mt-2 !px-5'>
                                <MdSaveAlt className="text-xl mr-1" />
                                Guardar
                            </Fab>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion className="w-full mb-3 !rounded-md !shadow-md dark:!bg-gray-600 !bg-gray-300">
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <div className="flex items-center gap-2">
                            <FaUserAlt className="text-3xl" />
                            <Typography component="span" className="!text-lg font-semibold ps-2">
                                Perfil general
                            </Typography>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails className="bg-gray-100 dark:bg-gray-500 p-3 rounded-b-md">
                        <div className="flex flex-col items-center gap-2">

                            <TextField
                                fullWidth
                                size="small"
                                multiline
                                maxRows={3}
                                // defaultValue=""
                                inputProps={{ maxLength: 50 }}
                                className="!bg-white dark:!bg-gray-600 !w-[75%] !m-2"
                            />
                        </div>
                    </AccordionDetails>
                </Accordion> */}

            </CardCustom>
        </>
    )
}

export default ConfigHardware