import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { request } from '../../../../utils/js/request';
import { backend } from '../../../../utils/routes/app.routes';
import LoadingTable from '../../../../components/LoadingTable';
import { Fab, TableFooter, TablePagination, useMediaQuery } from '@mui/material';
import { FaCheckCircle, FaCircle, FaTimes } from 'react-icons/fa';
import { FaPen, FaTableCellsLarge } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import MobileList from './MobileList';

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

const HEADERS = ["Matrícula", "Equipo / Cliente", "Nro de serie", "Estado", "Conexión", "Latitud", "Longitud", "Potencia", "Alimentación", "Modo", ""]
const BORDER_CLASSES = {
    0: "border-l-green-600",
    1: "border-l-amber-600",
    2: "border-l-red-600",
    3: "border-l-purple-600"
};
const PLACEHOLDER_EQUIPMENT = [{
    id: null,
    serial: null,
    equipmentmodels: { name: "", brand: "", type: 0 },
    influxData: { "d/c": true }
}]

export default function TableGeneral({ filters, filtersEquipments, filtersColumns, setElementSelected, searchValue }) {
    const navigate = useNavigate()
    const isMobile = useMediaQuery('(max-width: 600px)')
    const [loading, setLoading] = useState(true)
    const [allElements, setAllElements] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(25)

    useEffect(() => {
        let cancelled = false
        const getElements = async () => {
            try {
                const { data } = await request(`${backend.Reconecta}/Elements`, 'GET')
                if (cancelled) return
                setAllElements(data)
                setLoading(false)
            } catch (e) {
                console.log(e)
            }
        }
        getElements()
        const interval = setInterval(getElements, 10000)
        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [])

    const elements = useMemo(() => {
        const search = searchValue.toLowerCase()
        return allElements
            .filter((element) => filters[element.type])
            .map((element) => {
                const equipments = element.type === 3
                    ? PLACEHOLDER_EQUIPMENT.filter((eq) => filtersEquipments[eq.equipmentmodels.type])
                    : element.equipments.filter((eq) => filtersEquipments[eq.equipmentmodels.type])
                return { ...element, equipments }
            })
            .filter((element) => element.equipments.length > 0)
            .filter((element) => (
                element.name.toLowerCase().includes(search) ||
                element.description?.toLowerCase().includes(search) ||
                element.equipments.some((equipment) =>
                    equipment.serial?.toLowerCase().includes(search) ||
                    equipment.equipmentmodels.name?.toLowerCase().includes(search) ||
                    equipment.equipmentmodels.brand?.toLowerCase().includes(search) ||
                    equipment.observation?.toLowerCase().includes(search)
                )
            ))
    }, [allElements, filters, filtersEquipments, searchValue])

    useEffect(() => {
        setPage(0)
    }, [filters, filtersEquipments, searchValue, rowsPerPage])

    useEffect(() => {
        if (page > 0 && page * rowsPerPage >= elements.length) {
            setPage(0)
        }
    }, [elements.length, page, rowsPerPage])

    const handleSelected = useCallback((equipment, element) => {
        setElementSelected({
            ...equipment,
            elementName: element.name,
            elementDescription: element.description,
            elementType: element.type,
            clients: element.clients,
            substationSerial: element.serial,
            id: equipment.id ?? element.id,
        })
    }, [setElementSelected])

    const handleChangePage = useCallback((_, newPage) => {
        setPage(newPage)
    }, [])

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }, [])

    const elementsFiltered = useMemo(
        () => elements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [elements, page, rowsPerPage]
    )
    if (loading) return <LoadingTable />

    if (isMobile) {
        return (
            <div className='w-full flex flex-col text-black dark:text-white'>
                <MobileList
                    elementsFiltered={elementsFiltered}
                    filtersColumns={filtersColumns}
                    handleSelected={handleSelected}
                />
                <TablePagination
                    component='div'
                    count={elements.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage='Cantidad de nodos'
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {HEADERS.map((header, index) => (
                            filtersColumns[index] && <StyledTableCell key={index}>{header}</StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {elementsFiltered.map((row) =>
                        row.type !== 3 ?
                            row.equipments.map((equipment, index) => (
                                <StyledTableRow key={`${row.id}-${index}`}>
                                    {index === 0 && (
                                        <StyledTableCell rowSpan={row.equipments.length} className='min-w-96'>
                                            <div className='w-full flex'>
                                                <div className='w-11/12'>
                                                    {row.name} <br /> {row.description}
                                                </div>
                                                <div className='w-1/12'>
                                                    <Fab title='Editar nodo' size='small' className='!bg-yellow-400 !z-0' onClick={() => navigate(`/editElement/${row.id}`)} >
                                                        <FaPen />
                                                    </Fab>
                                                </div>
                                            </div>
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell className={`${BORDER_CLASSES[equipment.equipmentmodels.type]} border-l-8`}>{equipment.equipmentmodels.name} {equipment.equipmentmodels.brand} <br /> {equipment.observation}</StyledTableCell>
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
                                    {filtersColumns[8] && (
                                        <StyledTableCell >
                                            {equipment.equipmentmodels.type === 1 && (
                                                <span className='flex items-center gap-x-2'>
                                                    {equipment.influxData["ac"]?.[0]?.value === 1 ? "Red Electrica" : equipment.influxData["ac"]?.[0]?.value === 0 ? "Batería" : "Desconocido"}
                                                </span>
                                            )}
                                        </StyledTableCell>
                                    )}
                                    {filtersColumns[9] && (
                                        <StyledTableCell >
                                            {equipment.equipmentmodels.type === 1 && (
                                                <span className='flex items-center gap-x-2'>
                                                    {equipment.influxData["local"]?.[0]?.value === 1 ? "Local" : equipment.influxData["local"]?.[0]?.value === 0 ? "Remoto" : "Desconocido"}
                                                </span>
                                            )}
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell align='center'>
                                        <Fab size='small' className='!bg-blue-300' onClick={() => handleSelected(equipment, row)} ><FaTableCellsLarge /> </Fab>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )) :
                            row.clients.map((client, index) => (
                                <StyledTableRow key={`${row.id}-${index}`}>
                                    {index === 0 && (
                                        <StyledTableCell rowSpan={row.clients.length} className='min-w-96'>
                                            <div className='w-full flex'>
                                                <div className='w-11/12'>
                                                    {row.name}
                                                </div>
                                                <div className='w-1/12'>
                                                    <Fab title='Editar nodo' size='small' className='!bg-yellow-400 !z-0' onClick={() => navigate(`/editElement/${row.id}`)} >
                                                        <FaPen />
                                                    </Fab>
                                                </div>
                                            </div>
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell className={`${BORDER_CLASSES[0]} border-l-8`}>{client.name}</StyledTableCell>
                                    {filtersColumns[2] && (
                                        <StyledTableCell>{client.meter}</StyledTableCell>
                                    )}
                                    {filtersColumns[3] && (
                                        <StyledTableCell >
                                            <span className='flex items-center gap-x-2'>
                                                <FaCircle className={`${client.status ? "text-red-500" : "text-green-500"}`} />
                                                {client.status ? "En servicio" : "Fuera de servicio"}
                                            </span>
                                        </StyledTableCell>
                                    )}
                                    {filtersColumns[4] && (
                                        <StyledTableCell>
                                            <span className='flex items-center gap-x-2'>
                                                -
                                            </span>
                                        </StyledTableCell>
                                    )}
                                    {index === 0 && filtersColumns[5] && (
                                        <StyledTableCell rowSpan={row.clients.length}>
                                            {row.lat}
                                        </StyledTableCell>
                                    )}
                                    {index === 0 && filtersColumns[6] && (
                                        <StyledTableCell rowSpan={row.clients.length}>
                                            {row.lon}
                                        </StyledTableCell>
                                    )}
                                    {index === 0 && filtersColumns[7] && (
                                        <StyledTableCell rowSpan={row.clients.length}>
                                            {row.power}
                                        </StyledTableCell>
                                    )}
                                    {filtersColumns[8] && (
                                        <StyledTableCell>
                                            <span className='flex items-center gap-x-2'>
                                                -
                                            </span>
                                        </StyledTableCell>
                                    )}
                                    {filtersColumns[9] && (
                                        <StyledTableCell>
                                            <span className='flex items-center gap-x-2'>
                                                -
                                            </span>
                                        </StyledTableCell>
                                    )}
                                    {index === 0 && (
                                        <StyledTableCell rowSpan={row.clients.length} align='center'>
                                            <Fab size='small' className='!bg-blue-300' onClick={() => handleSelected({}, row)} ><FaTableCellsLarge /> </Fab>
                                        </StyledTableCell>
                                    )}
                                </StyledTableRow>
                            ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            colSpan={HEADERS.length}
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