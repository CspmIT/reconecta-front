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

const TablesEvents = ({ initialData }) => {
    let headers = ["", "Database ID", "Evento", "Prioridad"];
    const type_vars = ["Log", "Output", "Event"];
    const [data, setData] = useState(initialData || []);
    const [expanded, setExpanded] = useState({});
    const [open, setOpen] = useState(false);
    const [indexFile, setIndexFile] = useState(null);

    const toggleExpand = (type) => {
        setExpanded((prev) => ({ ...prev, [type]: !prev[type] }));
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
                        index_file: checked ? 0 : null
                    };
                }
                return row;
            })
        );
    }, []);



    useEffect(() => {
        if (initialData[0]?.id_version !== 2) {
            headers.shift()
        } else {
            let dataSorted = [...initialData].sort((a, b) => a.index_file - b.index_file)
            let dataIndex = []
            dataSorted.forEach(item => {
                if (item.index_file !== null && item.id_event_influx % 2 === 0) {
                    dataIndex[item.index_file] = [item.index_file, item.id_event_influx]
                }
            })
            setIndexFile(dataIndex)
        }
    }, [])


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
                            <StyledTableRow
                                onClick={() => toggleExpand(type)}
                                style={{ cursor: 'pointer', backgroundColor: '#e0e0e0' }}
                            >
                                <StyledTableCell colSpan={7}>
                                    <div className='justify-between flex'>
                                        <span><b>{type}</b> {expanded[type] ? '▲' : '▼'}</span>
                                        {/* {i === 0 && initialData[0]?.id_version === 2 && (
                                            <IconButton>
                                                <Save />
                                            </IconButton>
                                        )} */}
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
                                                    <option value='' disabled></option>
                                                    {Array.from({ length: 144 }, (_, i) => (
                                                        <option key={i} value={i}>{i}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </StyledTableCell>
                                    )}
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
                                        <CustomSelect value={row.priority} />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <input type='checkbox' className='ml-3 w-5 h-5' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <input type='checkbox' className='ml-3 w-5 h-5' />
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
