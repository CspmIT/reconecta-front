import React, { useCallback, useEffect, useState } from 'react'
import {
    Box, IconButton, Modal, Paper, styled, Table, TableBody, TableCell,
    tableCellClasses, TableContainer, TableHead, TableRow, Typography
} from '@mui/material'
import flashIcon from '../../../../assets/img/ConfigNotifications/flash_icon.png'
import envelopIcon from '../../../../assets/img/ConfigNotifications/envelop.png'
import CustomSelect from './CustomSelect'
import ModalEdit from './ModalEdit'
import { Close, Info, Save } from '@mui/icons-material'
import Swal from 'sweetalert2'
import { request } from '../../../../utils/js/request'
import { backend } from '../../../../utils/routes/app.routes'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.common.black,
        fontSize: 18,
        fontWeight: 'bold'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& td[rowspan]:not([rowspan="1"])': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        borderBottom: 0
    },
}));

const TablesEvents = ({ initialData, handleNewConfig }) => {
    let headers = ["", "Database ID", "Evento", "Prioridad"];
    const type_vars = ["Log", "Output", "Event"];
    const [data, setData] = useState(initialData || []);
    const [expanded, setExpanded] = useState({});
    const [open, setOpen] = useState(false);
    const toggleExpand = (type) => {
        setExpanded((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const getAvailableOptions = (currentValue) => {
        const used = data
            .filter(item => item.index_file !== null && item.index_file !== '' && item.id_event_influx % 2 === 0)
            .map(item => item.index_file)
        return Array.from({ length: 144 }, (_, i) => i).filter(i => i === currentValue || !used.includes(i));
    };

    const groupedData = type_vars.reduce((acc, type) => {
        acc[type] = data.filter(row => row.type_var === type);
        return acc;
    }, {});

    const handleChangeName = (id, newName) => {
        const updatedData = [...data]
            .map(row => row.id === id ? { ...row, name: newName } : row);
        setData(updatedData);
    }

    const handleOpen = () => setOpen(true);

    const handleChangeIndexFile = (id_event_influx, value) => {
        const newValue = parseInt(value, 10);
        if (isNaN(newValue)) return;

        setData(prevData =>
            prevData.map(row =>
                row.id_event_influx === id_event_influx
                    ? { ...row, index_file: newValue }
                    : row
            )
        );
    };

    const handleToggleCheckbox = useCallback((id_event_influx, checked) => {
        setData(prevData =>
            prevData.map(row => {
                if (row.id_event_influx === id_event_influx) {
                    return {
                        ...row,
                        index_file: checked ? '' : null
                    };
                }
                return row;
            })
        );
    }, []);

    const saveIndexFiles = async () => {
        Swal.fire({
            title: "Guardar configuraciones",
            icon: "question",
            html: "¿Desea guardar las configuraciones cargadas?",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar"
        }).then(async (response) => {
            if (!response.isConfirmed) {
                return
            }
            Swal.fire({
                title: "Aguarde un momento",
                html: "Guardando la configuración",
                didOpen: () => {
                    Swal.showLoading();
                }
            })
            try {
                const dataFile = data
                    .filter(item => item.index_file !== null && item.index_file !== '' && item.id_event_influx % 2 === 0)
                    .sort((a, b) => a.index_file - b.index_file)
                    .map(item => [item.index_file, item.id_event_influx])
                await request(`${backend.Reconecta}/ConfigNotifyIndex`, 'PATCH', dataFile)
                Swal.close()
            } catch (e) {
                console.log(e)
                Swal.close()
            }
        })
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {headers.map((header, index) => (
                            <StyledTableCell key={index}>{header}</StyledTableCell>
                        ))}
                        <StyledTableCell>
                            <img src={flashIcon} alt="Flash Icon" style={{ width: '50px', height: '50px' }} />
                        </StyledTableCell>
                        <StyledTableCell>
                            <img src={envelopIcon} alt="Envelope Icon" style={{ width: '50px', height: '50px' }} />
                        </StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {type_vars.map((type, i) => (
                        <React.Fragment key={type}>
                            <StyledTableRow className='bg-[#e0e0e0]'>
                                <StyledTableCell colSpan={7}>
                                    <div className='justify-between flex'>
                                        <span className='cursor-pointer' onClick={() => toggleExpand(type)}><b>{type}</b> {expanded[type] ? '▲' : '▼'}</span>
                                        {i === 0 && initialData[0]?.id_version === 2 && (
                                            <IconButton onClick={saveIndexFiles}>
                                                <Save />
                                            </IconButton>
                                        )}
                                    </div>
                                </StyledTableCell>
                            </StyledTableRow>
                            {expanded[type] && groupedData[type].map((row, index) => (
                                <StyledTableRow key={index}>
                                    {row.id_event_influx % 2 === 0 && row.id_version === 2 && (
                                        <StyledTableCell rowSpan={2}>
                                            <div className='flex items-center justify-center'>
                                                <input
                                                    type='checkbox'
                                                    className='ml-3 w-5 h-5'
                                                    checked={row.index_file !== null}
                                                    onChange={e => handleToggleCheckbox(row.id_event_influx, e.target.checked)}
                                                />
                                                <select
                                                    className='ml-3 w-28 h-8 border border-black rounded bg-white'
                                                    value={row.index_file ?? ''}
                                                    disabled={row.index_file === null}
                                                    onChange={(e) =>
                                                        handleChangeIndexFile(row.id_event_influx, e.target.value)
                                                    }
                                                >
                                                    <option value='' disabled>Seleccionar...</option>
                                                    {getAvailableOptions(row.index_file).map(i => (
                                                        <option key={i} value={i}>{i}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </StyledTableCell>
                                    )}
                                    {row.id_version !== 2 && (<StyledTableCell />)}

                                    <StyledTableCell>{row.id_database}</StyledTableCell>
                                    <StyledTableCell>{row.name}
                                        {row.description && (
                                            <IconButton onClick={handleOpen}>
                                                <Info />
                                            </IconButton>
                                        )}
                                        <ModalEdit data={row} setValueName={handleChangeName} />
                                    </StyledTableCell>
                                    <StyledTableCell className='overflow-visible'>
                                        <CustomSelect value={row.priority} handleNewConfig={handleNewConfig} idEvent={row.id} />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <input type='checkbox' className='ml-3 w-5 h-5' defaultChecked={row.flash_screen} onChange={e => handleNewConfig(2, e.target.checked, row.id)} />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <input type='checkbox' className='ml-3 w-5 h-5' defaultChecked={row.alarm} onChange={e => handleNewConfig(3, e.target.checked, row.id)} />
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TablesEvents;
