import React, { useState, useEffect } from 'react';
import CardCustom from '../../../../components/CardCustom/index.jsx';
import TableCustom from '../../../../components/TableCustom/index.jsx';
import { Button, Fab, FormControl, FormLabel, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import LoaderComponent from '../../../../components/Loader/index.jsx';
import { Add, Delete, Edit } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import autoTable from 'jspdf-autotable';
import { request } from '../../../../utils/js/request.js';
import { backend } from '../../../../utils/routes/app.routes.js';
import Swal from 'sweetalert2';
import { FaCircle, FaFilter } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import { status } from '../../utils/status';
import { type_task } from '../../utils/type_task';


function BinnacleList({ changeView }) {
  const [dataTable, setDataTable] = useState({})
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    activo: '',
    tipoTarea: '',
    estado: '',
  });
  const [originalData, setOriginalData] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const [activosUnicos, setActivosUnicos] = useState([]);

  const isDarkMode = theme.palette.mode === 'dark';

  const handleNew = (id = 0) => {
    changeView(id);
  };

  const handleFilter = () => {
    setShowFilters(!showFilters);
  };

  // DEFINO LAS COLUMNAS DE LA TABLA
  const columnsCriticos = [
    {
      accessorKey: "order",
      header: "#Orden",
      size: 50,
      muiTableBodyCellProps: {
        align: 'center',
        sx: { minWidth: 30, maxWidth: 50, width: 50, padding: 0 },
      },
      muiTableHeadCellProps: {
        align: 'center',
      }
    },
    {
      accessorKey: "id_element",
      header: "Activo",
      size: 100,
      muiTableBodyCellProps: {
        align: "center",
        sx: {
          wordWrap: "break-word",
          whiteSpace: "normal",
        },
      },
      muiTableHeadCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "lat",
      header: "Latitud",
      size: autoTable,
      muiTableBodyCellProps: {
        align: 'center',
        className: '!hidden sm:!table-cell',
      },
      muiTableHeadCellProps: {
        align: 'center',
        className: '!hidden sm:!table-cell',
      },
    },
    {
      accessorKey: "lon",
      header: "Longitud",
      size: autoTable,
      muiTableBodyCellProps: {
        align: 'center',
        className: '!hidden sm:!table-cell',
      },
      muiTableHeadCellProps: {
        align: 'center',
        className: '!hidden sm:!table-cell',

      }
    },
    {
      accessorKey: "type_task",
      header: "Tipo de Tarea",
      size: 5,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' }
    },
    {
      accessorKey: "task",
      header: "Tarea",
      size: 250,
      minSize: 250,
      maxSize: 250,
      muiTableBodyCellProps: {
        align: "center",
        sx: {
          wordWrap: "break-word",
          whiteSpace: "normal",
        },
      },
      muiTableHeadCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      size: autoTable,
      muiTableHeadCellProps: { align: 'center' },
      Cell: ({ row }) => {
        const status = row.original.status;
        const color = status === "En Servicio" ? "text-green-500" : status === "Fuera de Servicio" ? "text-red-500" : "text-gray-500";
        return (
          <div className="flex justify-start items-center">
            <FaCircle className={`${color} mr-2`} />
            <span className="hidden sm:inline">{status}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "createdAtFormatted",
      header: "Fecha",
      size: autoTable,
      muiTableBodyCellProps: { align: 'center' },
      muiTableHeadCellProps: { align: 'center' }
    },
    {
      header: '',
      accessorKey: 'edit',
      size: 5,
      disableFilters: true,
      enableSorting: false,
      enableGlobalFilter: false,
      muiTableBodyCellProps: {
        align: 'center',
      },
      Cell: ({ row }) => {
        if (!row.original.subRows) {
          return (
            <div className="flex justify-end">
              <Tooltip title="Editar" arrow>
                <Link onClick={() => handleNew(row.original.id)}>
                  <Fab
                    className="!flex !justify-center !items-center !text-gray-600 !bg-yellow-400 hover:!bg-yellow-500 shadow-slate-400 shadow-md"
                    size="small"
                    aria-label="edit"
                  >
                    <Edit />
                  </Fab>
                </Link>
              </Tooltip>
            </div>
          );
        }
      },
    },
    {
      header: '',
      accessorKey: 'delete',
      size: 5,
      disableFilters: true,
      enableSorting: false,
      enableGlobalFilter: false,
      muiTableBodyCellProps: {
        align: 'center',
      },
      Cell: ({ row }) => {
        if (!row.original.subRows) {
          return (
            <div className='flex justify-end'>
              <Tooltip title="Eliminar" arrow>
                <Fab
                  className='!flex !justify-center !items-center !bg-red-600 hover:!bg-red-700 shadow-slate-400 shadow-md'
                  size='small'
                  color='error'
                  aria-label='delete'
                  onClick={() => handleDelete(row.original.id)}
                >
                  <Delete />
                </Fab>
              </Tooltip>
            </div>
          );
        }
      },
    },
  ];

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await updateStatusToDeleted(id);
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar el registro.', 'error');
      }
    }
  };

  // CAMBIAR EL ESTADO DEL REGISTRO A "deleted" PARA NO TRAERLO EN LA TABLA
  const updateStatusToDeleted = async (id) => {
    try {
      const currentDate = new Date().toISOString();

      const response = await request(`${backend.Reconecta}/Binnacle/${id}/delete`, 'PATCH', {
        status: 'deleted',
        updatedAt: currentDate,
      });

      if (response.status === 200) {
        getValues();
        Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
      } else {
        Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
      }
    } catch (e) {
      console.error("Error al actualizar el estado del elemento:", e);
      Swal.fire('Error', 'Hubo un problema al eliminar el registro.', 'error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .replace(",", " ");
  };

  //OBTENER LOS VALORES DE LA TABLA
  const getValues = async () => {
    setLoading(true);
    try {
      const { data } = await request(`${backend.Reconecta}/Binnacle`, 'GET');

      const transformedData = data.map((item) => {
        const fechaOriginal = item.createdAt;
        return {
          ...item,
          id_element: item.element?.name || item.name_element || "Sin nombre",
          lat: item.lat || item.element?.lat || "No disponible",
          lon: item.lon || item.element?.lon || "No disponible",
          createdAt: fechaOriginal,
          createdAtFormatted: formatDate(fechaOriginal),
        };
      });

      const sortedData = transformedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOriginalData(sortedData);
      setDataTable(sortedData);

      const activos = [...new Set(sortedData.map(item => item.id_element))];
      setActivosUnicos(activos);

    } catch (e) {
      console.error("Error al obtener los datos:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getValues();
  }, []);

  // FILTROS DE LA TABLA
  const applyFilters = () => {
    const filtered = originalData.filter(item => {
      const activoMatch = !filters.activo || filters.activo === 'Todos' || item.id_element?.toLowerCase().includes(filters.activo.toLowerCase());
      const tipoTareaMatch = !filters.tipoTarea || filters.tipoTarea === 'Todos' || item.type_task?.toLowerCase() === filters.tipoTarea.toLowerCase();
      const estadoMatch = !filters.estado || filters.estado === 'Todos' || item.status?.toLowerCase() === filters.estado.toLowerCase();

      return activoMatch && tipoTareaMatch && estadoMatch;
    });

    setDataTable(filtered);
  };

  return (
    loading ? (
      <div className="w-full">
        <LoaderComponent />
      </div>
    ) : (
      <CardCustom className="dark:!bg-zinc-500 !border-zinc-200 dark:!border-gray-700 text-black p-4 w-full">
        <div className="relative flex justify-between items-center mb-4">
          <Fab
            onClick={handleFilter}
            className='!flex !justify-center !items-center'
            size='small'
            color='primary'
            aria-label='add'
          >
            <FaFilter />
          </Fab>
          <FormLabel className="w-full text-center !text-2xl">Bitácora</FormLabel>
          <Fab
            onClick={() => handleNew(0)}
            className='!flex !justify-center !items-center'
            size='small'
            color='primary'
            aria-label='add'
          >
            <Add />
          </Fab>
        </div>

        {showFilters && (
          <div className="my-3 bg-gray-200 dark:bg-zinc-700 shadow-md rounded-sm p-4 grid grid-cols-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <FormControl size="small" className=" bg-white dark:bg-zinc-400">
                <InputLabel id="activo-label">Activo</InputLabel>
                <Select
                  labelId="activo-label"
                  id="activo"
                  value={filters.activo}
                  label="Activo"
                  onChange={(e) => setFilters({ ...filters, activo: e.target.value })}
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="Todos">Todos...</MenuItem>
                  {activosUnicos.map((activo, index) => (
                    <MenuItem key={index} value={activo}>
                      {activo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" className=" bg-white dark:bg-zinc-400">
                <InputLabel id="type-task-label">Tipo de tarea</InputLabel>
                <Select
                  labelId="type-task-label"
                  id="type-task"
                  label="Tipo de tarea"
                  onChange={(e) => setFilters({ ...filters, tipoTarea: e.target.value })}
                  value={filters.tipoTarea}
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="Todos">Todos...</MenuItem>
                  {type_task.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.name}>
                      {tipo.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" className=" bg-white dark:bg-zinc-400">
                <InputLabel id="status-label">Estado</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  label="Estado"
                  onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                  value={filters.estado}
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="Todos">Todos...</MenuItem>
                  {status.map((estado) => (
                    <MenuItem key={estado.id} value={estado.name}>
                      {estado.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="w-full flex justify-center col-span-1 md:col-span-4 gap-4">
              <Button
                size='small'
                onClick={() => {
                  setFilters({ activo: '', tipoTarea: '', estado: '' });
                  setDataTable(originalData);
                }}
                variant="outlined"
              >
                Limpiar
              </Button>
              <Button
                size='small'
                onClick={() => {
                  applyFilters();
                }}
                variant="contained"
              >
                Aplicar
              </Button>
            </div>
          </div>
        )}

        <TableCustom
          getPage={dataTable}
          data={dataTable}
          columns={columnsCriticos}
          density="compact"
          header={{
            background: isDarkMode ? '#333' : 'rgb(190 190 190)',
            fontSize: '16px',
            fontWeight: 'bold',
            color: isDarkMode ? 'white' : 'black',
          }}
          toolbarClass={{
            background: isDarkMode ? '#333' : 'rgb(190 190 190)',
          }}
          body={{
            backgroundColor: isDarkMode ? '#1f2937' : 'rgba(209, 213, 219, 0.31)',
            color: isDarkMode ? 'white' : 'black',
          }}
          footer={{
            background: isDarkMode ? '#333' : 'rgb(190 190 190)',
            color: isDarkMode ? 'white' : 'black',
          }}
          pageSize={10}
          topToolbar
          sort
          pagination
        />

      </CardCustom>
    )
  );
}

export default BinnacleList;
