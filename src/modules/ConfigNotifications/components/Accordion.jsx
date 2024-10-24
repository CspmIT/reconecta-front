import React, { useState } from 'react';
import AccordionMui from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TableCustom from '../../../components/TableCustom';
import { ColumnsNot } from '../utils/DataTable/ColumnsNot';
import { dataNot } from '../utils/DataTable/dataNot';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';

const CustomAccordion = ({ title }) => {
    const [expanded, setExpanded] = useState(false);
    const [tableData, setTableData] = useState(dataNot);

    const handleChange = () => {
        setExpanded(!expanded);
    };

    const handlePriority = (id, newValue) => {
        setTableData(prevData =>
            prevData.map(row =>
                row.id === id ? { ...row, prioridad: newValue } : row
            )
        );
    };

    const handleCheck = (id, field) => {
        setTableData(prevData =>
            prevData.map(row =>
                row.id === id ? { ...row, [field]: row[field] === 1 ? 0 : 1 } : row
            )
        );
    };

    const saveData = () => {
        Swal.fire({
            html: "¿Estás seguro de Guardar los Cambios?",
            icon: "question",
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            showCancelButton: true,
            showCloseButton: true
        }).then(result => {
            if (result.isConfirmed) {
                console.log(tableData);
            }
        });
    };

    return (
        <AccordionMui expanded={expanded} onChange={handleChange} className='!rounded-md !shadow-md dark:!bg-gray-500 !bg-gray-300'>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                {title}
            </AccordionSummary>
            <AccordionDetails className='bg-zinc-100 dark:bg-zinc-900'>
                {expanded && (
                    <div className='p-5'>
                        <TableCustom
                            data={tableData} 
                            columns={ColumnsNot(handlePriority, handleCheck)}
                            density='compact'
                            header={{
                                background: 'rgb(190 190 190)',
                                fontSize: '18px',
                                fontWeight: 'bold',
                            }}
                            toolbarClass={{ background: 'rgb(190 190 190)' }}
                            body={{ backgroundColor: 'rgba(209, 213, 219, 0.31)' }}
                            footer={{ background: 'rgb(190 190 190)' }}
                            card={{
                                boxShadow: `1px 1px 8px 0px #00000046`,
                                borderRadius: '0.75rem',
                            }}
                        />
                        <div className='mt-5 w-full flex justify-center'>
                            <Button onClick={saveData} variant="contained">Guardar</Button>
                        </div>
                    </div>
                )}
            </AccordionDetails>
        </AccordionMui>
    );
}

export default CustomAccordion;
