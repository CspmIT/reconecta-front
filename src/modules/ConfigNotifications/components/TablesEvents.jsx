import { Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import flashIcon from '../../../assets/img/ConfigNotifications/flash_icon.png'
import envelopIcon from '../../../assets/img/ConfigNotifications/envelop.png'
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

const TablesEvents = ({ data }) => {
    const headers = ["Database ID", "Evento", "Prioridad"]
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {headers.map((header, index) => (
                            <StyledTableCell key={index}>{header}</StyledTableCell>
                        ))}
                        <StyledTableCell style={{ textAlign: 'center', padding: '8px' }}>
                            <img src={flashIcon} alt="Flash Icon" style={{ width: '50px', height: '50px' }} />
                        </StyledTableCell>
                        <StyledTableCell style={{ textAlign: 'center', padding: '8px' }}>
                            <img src={envelopIcon} alt="Envelope Icon" style={{ width: '50px', height: '50px' }} />
                        </StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell>{row.id_database}</StyledTableCell>
                            <StyledTableCell>{row.name}</StyledTableCell>
                            <StyledTableCell>{row.priority}</StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'center' }}>
                                <input type='checkbox' />
                            </StyledTableCell>
                            <StyledTableCell style={{ textAlign: 'center' }}>
                                <input type='checkbox' />
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TablesEvents