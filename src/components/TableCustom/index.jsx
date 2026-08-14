import {
	MRT_ExpandButton,
	MRT_GlobalFilterTextField,
	MRT_ShowHideColumnsButton,
	MRT_TablePagination,
	MRT_ToggleDensePaddingButton,
	MRT_ToggleFiltersButton,
	MRT_ToggleGlobalFilterButton,
	MaterialReactTable,
	useMaterialReactTable,
} from 'material-react-table'
import NoRegisterTable from './NoRegisterTable'
import { storage } from '../../storage/storage'
import { Box, IconButton, Tooltip } from '@mui/material'
import { PiBroomFill } from 'react-icons/pi'
import { useEffect } from 'react'
import { SiMicrosoftexcel } from 'react-icons/si'
import { mkConfig, generateCsv, download } from 'export-to-csv'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FaFilePdf } from 'react-icons/fa'

const csvOptions = {
	filename: 'Excel-export',
	fieldSeparator: ',',
	decimalSeparator: '.',
}

// export-to-csv y jspdf-autotable sólo aceptan primitivos: los arrays/objetos
// (ej. personalIds) hay que aplanarlos antes de generar el archivo.
const toPlainValue = (value) => {
	if (value === null || value === undefined) return ''
	if (value instanceof Date) return `${value.toLocaleDateString()} ${value.toLocaleTimeString()}`
	if (Array.isArray(value)) return value.map(toPlainValue).filter((v) => v !== '').join(' | ')
	if (typeof value === 'object') return Object.values(value).map(toPlainValue).filter((v) => v !== '').join(' | ')
	return value
}

// Aplana columnas agrupadas y descarta las que no tienen dato propio (ej. "Acciones"),
// para que el archivo exportado tenga las mismas columnas que se ven en la tabla.
const getExportableColumns = (cols, parentHeader = '') => {
	const flattened = []
	cols.forEach((column) => {
		if (column.columns) {
			flattened.push(...getExportableColumns(column.columns, column.header))
		} else if (column.exportFn || column.accessorFn || column.accessorKey) {
			flattened.push({
				header: column.header ?? '',
				parentHeader,
				accessorKey: column.accessorKey,
				accessorFn: column.accessorFn,
				exportFn: column.exportFn,
			})
		}
	})
	return flattened
}

const getCellValue = (row, col) => {
	// exportFn permite que una columna exporte el valor legible (nombres) en lugar del crudo (ids)
	if (col.exportFn) return col.exportFn(row)
	if (col.accessorFn) return col.accessorFn(row)
	// MRT admite accessorKey anidado con notación de puntos
	return String(col.accessorKey)
		.split('.')
		.reduce((acc, key) => (acc == null ? acc : acc[key]), row)
}

const TableCustom = ({ data, columns, ...prop }) => {
	// exportar en excel toda la info
	const handleExportData = () => {
		const flattenedColumns = getExportableColumns(columns)
		// columnHeaders garantiza el orden de las columnas y una única fila de encabezado
		const columnHeaders = flattenedColumns.map((col, i) => ({
			key: `c${i}`,
			displayLabel: col.parentHeader ? `${col.parentHeader} - ${col.header}` : String(col.header),
		}))
		const rows = data.map((row) =>
			Object.fromEntries(flattenedColumns.map((col, i) => [`c${i}`, toPlainValue(getCellValue(row, col))])),
		)
		const csvConfig = mkConfig({ ...csvOptions, columnHeaders })
		download(csvConfig)(generateCsv(csvConfig)(rows))
	}

	// Exportado de pdf
	const handleExportRowsPdf = (rows) => {
		const doc = new jsPDF()
		const flattenedColumns = getExportableColumns(columns)
		const tableData = rows.map((row) =>
			flattenedColumns.map((col) => String(toPlainValue(getCellValue(row.original, col)))),
		)
		const tableHeaders = flattenedColumns.map((col) => col.header)

		autoTable(doc, {
			head: [tableHeaders],
			body: tableData,
		})

		doc.save('pdf-export.pdf')
	}
	const filtros =
		storage.get('filter')?.reduce((acc, item) => {
			if (columns?.some((col) => col.accessorKey === item.name)) {
				acc = { id: item.name, value: item.value }
			}
			return acc
		}, {}) || {}
	// creo una constante con las configuracion inicial para poder modificar con props
	const tableInitialState = {
		density: prop.density ? prop.density : window.innerWidth < 750 ? 'compact' : 'comfortable',
		expanded: true,
		showColumnFilters: false,
		columnFilters: Object.keys(filtros).length ? [filtros] : [],
		columnVisibility: prop.columnVisibility,
		sorting: [],
		grouping: [],
	}
	// activacion de paginacion
	if (prop.pagination) {
		tableInitialState.pagination = { pageIndex: 0, pageSize: prop.pageSize || 5 }
	}
	// controlo si llega un agrupacion por columna
	if (prop.groupBy) {
		tableInitialState.grouping.push(prop.groupBy)
	}
	// controlo si llega un orden por columna
	if (prop.orderBy) {
		tableInitialState.sorting.push({ id: prop.orderBy, desc: false })
	}
	const hideColumn = prop?.onColumnVisibilityChange ? { onColumnVisibilityChange: prop.onColumnVisibilityChange } : ''
	const columnVisibility = prop?.columnVisibility ? { columnVisibility: prop.columnVisibility } : ''
	const pags = () => {
		prop.getPage(table, prop.priority)
	}
	const localization = {
		hideAll: 'Ocultar todo',
		showAll: 'Mostrar todo',
		// Puedes personalizar otros textos aquí si es necesario
	}

	const table = useMaterialReactTable({
		columns,
		data,
		localization,
		initialState: tableInitialState,
		state: {
			...columnVisibility,
		},
		positionToolbarAlertBanner: 'none',
		positionToolbarDropZone: 'none',
		enableTopToolbar: prop.topToolbar || false,
		enableStickyFooter: false,
		enableStickyHeader: true,
		enablePagination: prop.pagination ?? false,
		defaultColumn: {
			minSize: 10,
			size: 500
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
		muiTableContainerProps: { sx: { maxHeight: prop.pagination ? 'auto' : 50000 } },
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
		enableColumnFilters: prop.filter || false,
		// activa un boton que te genera un modal para editar el campo en la tabla, pero hay que combinarlo con otra funcion para el guardado, actualizacion, etc.
		enableEditing: false,
		// permite agrupar por columnas
		enableGrouping: prop.groupBy ? true : false,
		// junto con el de los 3 puntos de accion te permite ocultar columnas, o activando el toopbar
		enableHiding: prop.hide,
		// habilita el ordenamiento de columnas osea ordenar los datos por alguna columna en especifico
		enableSorting: prop.sort,

		// svg para cuando la tabla esta vacia
		renderEmptyRowsFallback: () => {
			return <NoRegisterTable />
		},

		// clases para el header de la tabla (muiTableHeadRowProps, muiTableHeadCellProps, muiTableHeadProps)
		muiTableHeadRowProps: {
			sx: {
				backgroundColor: 'transparent',
				boxShadow: 'none',
				border: 'none',
			},
		},

		muiTableHeadCellProps: (cell) => {
			return {
				sx: {
					backgroundColor: 'transparent',
					...prop.header,
				},
			}
		},

		// ------------------------------------

		// clases para la linea de herramientas de arriba ()
		muiTopToolbarProps: {
			sx: {},
		},
		// Se creo a mano las herramientas para poder escribir en español las opciones
		renderTopToolbar: ({ table }) => (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
					position: 'relative',
					backgroundColor: 'transparent',
					...prop.toolbarClass,
				}}
			>
				{prop.btnCustomToolbar && prop.btnCustomToolbar}
				{prop.exportExcel && (
					<IconButton
						onClick={() => handleExportData()}
						table={table}
						title='Exportar a excel'
						sx={{
							color: 'green',
						}}
					>
						<SiMicrosoftexcel />
					</IconButton>
				)}

				{prop.exportPdf && (
					<IconButton
						// si se descomenta este y se comenta el otro onclick se puede hacer que sea por linea la descarga, pero no tengo tiempo para hacerlo ahora
						// onClick={() => handleExportRows(table.getRowModel().rows)}
						onClick={() => handleExportRowsPdf(table.getPrePaginationRowModel().rows)}
						table={table}
						title='Exportar a PDF'
						sx={{
							color: 'red',
						}}
					>
						<FaFilePdf />
					</IconButton>
				)}
				<MRT_GlobalFilterTextField placeholder='Escriba su busqueda' table={table} />
				{prop.getPage && prop.checkAlert && (
					<IconButton
						onClick={() => pags()}
						table={table}
						title='Limpiar alertas'
						sx={{
							'&:hover': {
								backgroundColor: '#ecec97',
							},
							background: 'yellow',
							color: 'black',
						}}
					>
						<PiBroomFill />
					</IconButton>
				)}
				<MRT_ToggleGlobalFilterButton title='Buscar' table={table} />
				{prop.filter && <MRT_ToggleFiltersButton title='Filtrar' table={table} />}

				{prop.hide && <MRT_ShowHideColumnsButton title='Mostras/Ocultar Columnas' table={table} />}
				{prop.density && <MRT_ToggleDensePaddingButton title='Densidad' table={table} />}

				{/* descomentar si queremos hacer un fullScreen en la tabla */}
				{/* <MRT_ToggleFullScreenButton table={table} /> */}

				{/* descomentar si queremos hacer un boton de impresion en la tabla */}
				{/* <Tooltip title='Print'>
					<IconButton onClick={() => window.print()}>
						<Print />
					</IconButton>
				</Tooltip> */}
			</Box>
		),
		// ------------------------------------

		// clases para la linea de herramientas de abajo

		muiBottomToolbarProps: {
			sx: {
				minHeight: prop.pagination ? '3.5rem' : '2rem',
				backgroundColor: 'transparent',
				color: 'black !important',
				...prop.footer,
			},
		},

		// ------------------------------------

		// clases para el fondo y bordes de la tabla

		muiTablePaperProps: {
			sx: {
				backgroundColor: 'transparent',
				...prop.card,
			},
		},

		// ------------------------------------

		// clases para la paginacion

		muiPaginationProps: {
			showRowsPerPage: true,
			// El texto de las filas por paginas esta al final en el useEfect
		},
		paginationDisplayMode: 'pages',

		// ------------------------------------
		// clases para el body de la tabla(muiTableBodyCellProps, muiTableBodyProps, muiTableBodyRowProps)
		muiTableBodyRowProps: ({ row }) => ({
			sx: {
				...prop.body,
				backgroundColor: prop.ChangeColorRow ? prop.ChangeColorRow(row) && 'yellow' : undefined,
			},
		}),
		muiTableBodyCellProps: ({ row }) => ({
			sx: {
				color: prop.ChangeColorRow ? prop.ChangeColorRow(row) && 'black' : undefined,

				...prop.bodyContent,
			},
		}),
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
		// ------------------------------------

		// funcion para guardar las columnas que se ocultan

		...hideColumn,
	})
	useEffect(() => {
		const label = document.querySelector('label[for="mrt-rows-per-page"]')
		if (label) {
			label.innerText = 'Filas por página'
		}
	}, [])
	return <MaterialReactTable table={table} />
}

export default TableCustom
