import { MRT_ExpandButton, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import NoRegisterTable from './NoRegisterTable'
import { storage } from '../../storage/storage'

const TableCustom = ({ data, columns, ...prop }) => {
	const filtros =
		storage.get('filter')?.reduce((acc, item) => {
			return { id: item.name, value: item.value }
		}, {}) || []
	// creo una constante con las configuracion inicial para poder modificar con props
	const tableInitialState = {
		density: prop.density ? prop.density : window.innerWidth < 750 ? 'compact' : 'comfortable',
		expanded: true,
		showColumnFilters: false,
		columnFilters: [filtros],
		columnVisibility: prop.columnVisibility,
		sorting: [],
		grouping: [],
	}
	// activacion de paginacion
	if (prop.pagination) {
		tableInitialState.pagination = { pageIndex: 0, pageSize: 5 }
	}
	// controlo si llega un agrupacion por columna
	if (prop.groupBy) {
		tableInitialState.grouping.push(prop.groupBy)
	}
	// controlo si llega un orden por columna
	if (prop.orderBy) {
		tableInitialState.sorting.push({ id: prop.orderBy, desc: false })
	}

	const table = useMaterialReactTable({
		columns,
		data,
		initialState: tableInitialState,
		state: {
			columnVisibility: prop.columnVisibility,
		},
		groupedColumnMode: 'remove',
		positionToolbarAlertBanner: 'none',
		positionToolbarDropZone: 'none',
		enableTopToolbar: prop.topToolbar || false,
		enableStickyFooter: false,
		enableStickyHeader: true,
		enablePagination: prop.pagination ?? false,
		defaultColumn: {
			minSize: 10,
		},
		displayColumnDefOptions: {
			'mrt-row-expand': {
				size: 5,
				minSize: 1,
				maxSize: 10,
				Cell: ({ row, table }) => {
					if (!row.depth) {
						return <MRT_ExpandButton row={row} table={table} />
					}
				},
			},
		},
		muiTableContainerProps: { sx: { maxHeight: prop.pagination ? 500 : 50000 } },
		// HABILITACION DE ROWS
		enableBatchRowSelection: prop.checkbox ?? false,
		enableMultiRowSelection: prop.checkbox ?? false,
		enableRowSelection: prop.checkbox ?? false,
		enableSelectAll: prop.checkbox ?? false,
		enableSubRowSelection: prop.checkbox ?? false,
		// HABILITACION DE COLUMNA
		enableFullScreenToggle: prop.fullScreen || false,
		// si esta true te deja copiar el campo de la tabla
		enableClickToCopy: prop.copy,
		// habilita los 3 puntos para acciones por columna
		enableColumnActions: false,
		// habilita hacer drag and drop aunque faltan otras opciones para que funcione al 100%
		enableColumnDragging: false,
		// habilita el poder filtrar por todas las columnas
		enableColumnFilters: true,
		// activa un boton que te genera un modal para editar el campo en la tabla, pero hay que combinarlo con otra funcion para el guardado, actualizacion, etc.
		enableEditing: false,
		// permite agrupar por columnas
		enableGrouping: prop.grouping,
		// junto con el de los 3 puntos de accion te permite ocultar columnas, o activando el toopbar
		enableHiding: prop.hide,
		// habilita el ordenamiento de columnas osea ordenar los datos por alguna columna en especifico
		enableSorting: prop.sort,

		// svg para cuando la tabla esta vacia
		renderEmptyRowsFallback: () => {
			return <NoRegisterTable />
		},

		muiTableBodyRowProps: () => {
			return {
				sx: prop.body,
			}
		},
		muiTableHeadCellProps: {
			sx: prop.header,
		},
		muiTopToolbarProps: {
			sx: {
				minHeight: '3rem',
				...prop.toolbarClass,
			},
		},
		muiBottomToolbarProps: {
			sx: {
				minHeight: prop.pagination ? '3.5rem' : '2rem',
				...prop.footer,
			},
		},
		muiTablePaperProps: {
			sx: prop.card,
		},
		muiPaginationProps: {
			showRowsPerPage: false,
			// sx: {
			// 	'& .MuiPaginationItem-root': {
			// 		color: 'white',
			// 	},
			// },
		},
		muiTableBodyProps: {
			sx: () => ({
				'& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td': {
					backgroundColor: '#cdcdcd23',
				},
				'& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td': {
					backgroundColor: '#a9a8a88b',
				},
				'& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td': {
					backgroundColor: '#68686822',
				},
				'& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td': {
					backgroundColor: '#a9a8a88b',
				},
			}),
		},
		paginationDisplayMode: 'pages',
		onColumnVisibilityChange: prop.onColumnVisibilityChange,
	})

	return <MaterialReactTable table={table} />
}

export default TableCustom
