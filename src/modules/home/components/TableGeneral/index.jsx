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
import { FaCircle } from 'react-icons/fa';
import { FaTableCellsLarge } from 'react-icons/fa6';

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
        border: 0,
    },
}));


export default function TableGeneral({ filters, setElementSelected }) {
    const [loading, setLoading] = useState(true)
    const [elements, setElements] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const headers = ["Matrícula", "Equipo", "Nro de serie", "Estado", "Conexión", "Latitud", "Longitud", "Potencia", ""]
    const getElements = async () => {
        try {
            const { data } = await request(`${backend.Reconecta}/Elements`, 'GET')
            setElements(data)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getElements()
    }, [])

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
                                <StyledTableCell key={index}>{header}</StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {elementsFiltered.map((row) =>
                            filters[row.type] &&
                            row.equipments.map((equipment, index) => (
                                <StyledTableRow key={`${row.id}-${index}`}>
                                    {index === 0 && (
                                        <StyledTableCell rowSpan={row.equipments.length}>
                                            {row.name} <br /> {row.description}
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell>{equipment.equipmentmodels.name} {equipment.equipmentmodels.brand}</StyledTableCell>
                                    <StyledTableCell>{equipment.serial}</StyledTableCell>
                                    <StyledTableCell > <span className='flex items-center gap-x-2'>
                                        <FaCircle className={`${row.status ? "text-red-500" : "text-green-500"}`} />  {row.status ? "Cerrado" : "Abierto"}
                                    </span>
                                    </StyledTableCell>
                                    <StyledTableCell>Conectado</StyledTableCell>
                                    {index === 0 && (
                                        <StyledTableCell rowSpan={row.equipments.length}>
                                            {row.lat}
                                        </StyledTableCell>
                                    )}
                                    {index === 0 && (
                                        <StyledTableCell rowSpan={row.equipments.length}>
                                            {row.lon}
                                        </StyledTableCell>
                                    )}
                                    {index === 0 && (
                                        <StyledTableCell rowSpan={row.equipments.length}>
                                            {row.power}
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell align='center'>
                                        <Fab size='small' className='!bg-blue-300' onClick={() => setElementSelected(equipment)} ><FaTableCellsLarge /> </Fab>
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
                                labelRowsPerPage="Número de registros"
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
    )
}