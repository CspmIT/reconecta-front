import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { request } from '../../../../utils/js/request';
import { backend } from '../../../../utils/routes/app.routes';
import LoadingTable from '../../../../components/LoadingTable';
import { Fab, TableFooter, TablePagination } from '@mui/material';
import { FaCheckCircle, FaCircle, FaTimes } from 'react-icons/fa';
import { FaPen, FaTableCellsLarge } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

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
    // hide last border
    '&:last-child td, &:last-child th': {
        borderBottom: 0
    },
}));


export default function TableGeneral({ filters, filtersEquipments, filtersColumns, setElementSelected, searchValue }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [elements, setElements] = useState([])
    const [allElements, setAllElements] = useState([]) // Para guardar todos los elementos y no perder el estado al filtrar
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const headers = ["Matrícula", "Equipo", "Nro de serie", "Estado", "Conexión", "Latitud", "Longitud", "Potencia", ""]
    const borderClasses = {
        0: "border-l-green-600",
        1: "border-l-amber-600",
        2: "border-l-red-600",
        3: "border-l-purple-600"
    };
    const getElements = async () => {
        try {
            const { data } = await request(`${backend.Reconecta}/Elements`, 'GET')
            setAllElements(data)
            setElements(data)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    const filterElements = async () => {
        const elementsxType = allElements.filter((element) => {
            if (filters[element.type]) {
                return element
            }
        })
        const elementEquipments = elementsxType.map((element) => {
            if (element.type === 3) {
                element.equipments = [{
                    id: element.clients.id,
                    serial: element.serial,
                    equipmentmodels: {
                        name: "",
                        brand: "",
                        type: 0
                    },
                    influxData: {
                        "d/c": true
                    }
                }]
            }
            const filteredEquipments = element.equipments.filter((equipment) => {
                return filtersEquipments[equipment.equipmentmodels.type]
            })
            return { ...element, equipments: filteredEquipments }
        })
        const filteredElements = elementEquipments.filter((element) => {
            return filters[element.type] && element.equipments.length > 0
        })
        const filteredBySearch = filteredElements.filter((element) => {
            return element.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                element.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
                element.equipments.some(equipment =>
                    equipment.serial?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    equipment.equipmentmodels.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    equipment.equipmentmodels.brand?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    equipment.observation?.toLowerCase().includes(searchValue.toLowerCase())
                );
        })
        setElements(filteredBySearch)
        if (filteredBySearch.length < rowsPerPage) {
            setPage(0)
        }
    }

    const handleSelected = (equipment, element) => {
        equipment.elementName = element.name
        equipment.elementDescription = element.description
        equipment.elementType = element.type
        equipment.clients = element.clients
        equipment.substationSerial = element.serial
        if (!equipment.id) {
            equipment.id = element.id
        }
        setElementSelected(equipment)
    }

    useEffect(() => {
        getElements()
    }, [])

    useEffect(() => {
        filterElements()
    }, [filters, filtersEquipments, allElements, rowsPerPage, searchValue])

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const elementsFiltered = elements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    return (
        loading ? <LoadingTable /> :
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {headers.map((header, index) => (
                                filtersColumns[index] && <StyledTableCell key={index}>{header}</StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {elementsFiltered.map((row) =>
                            row.equipments.map((equipment, index) => (
                                <StyledTableRow key={`${row.id}-${index}`}>
                                    {index === 0 && (
                                        <StyledTableCell rowSpan={row.equipments.length} className='min-w-96'>
                                            <div className='w-full flex'>
                                                <div className='w-11/12'>
                                                    {row.name} <br /> {row.description}
                                                </div>
                                                <div className='w-1/12'>
                                                    <Fab title='Editar nodo' size='small' className='!bg-yellow-400' onClick={() => navigate(`/editElement/${row.id}`)} >
                                                        <FaPen />
                                                    </Fab>
                                                </div>
                                            </div>
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell className={`${borderClasses[equipment.equipmentmodels.type]} border-l-8`}>{equipment.equipmentmodels.name} {equipment.equipmentmodels.brand} <br /> {equipment.observation}</StyledTableCell>
                                    {filtersColumns[2] && (
                                        <StyledTableCell>{equipment.serial}</StyledTableCell>
                                    )}
                                    {filtersColumns[3] && (
                                        <StyledTableCell >
                                            {equipment.equipmentmodels.type === 1 && (
                                                <span className='flex items-center gap-x-2'>
                                                    <FaCircle className={`${equipment.influxData["d/c"]?.[0]?.value === 1 ? "text-red-500" : equipment.influxData["d/c"]?.[0]?.value === 0 ? "text-green-500" : "text-yellow-500"}`} />
                                                    {equipment.influxData["d/c"]?.[0]?.value === 1 ? "Cerrado" : equipment.influxData["d/c"]?.[0]?.value === 0 ? "Abierto" : "Desconocido"}
                                                </span>
                                            )}
                                        </StyledTableCell>
                                    )}
                                    {filtersColumns[4] && (
                                        <StyledTableCell>
                                            <span className='flex items-center gap-x-2'>
                                                {equipment.influxData?.["d/c"] ? (
                                                    <>
                                                        <FaCheckCircle size={20} className='text-green-700' /> Online
                                                    </>
                                                ) : (<>
                                                    <FaTimes size={20} className='text-red-700' /> Sin señal
                                                </>)}
                                            </span>
                                        </StyledTableCell>
                                    )}
                                    {index === 0 && filtersColumns[5] && (
                                        <StyledTableCell rowSpan={row.equipments.length}>
                                            {row.lat}
                                        </StyledTableCell>
                                    )}
                                    {index === 0 && filtersColumns[6] && (
                                        <StyledTableCell rowSpan={row.equipments.length}>
                                            {row.lon}
                                        </StyledTableCell>
                                    )}
                                    {index === 0 && filtersColumns[7] && (
                                        <StyledTableCell rowSpan={row.equipments.length}>
                                            {row.power}
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell align='center'>
                                        <Fab size='small' className='!bg-blue-300' onClick={() => handleSelected(equipment, row)} ><FaTableCellsLarge /> </Fab>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                colSpan={headers.length}
                                count={elements.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                labelRowsPerPage="Cantidad de nodos"
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
    )
}