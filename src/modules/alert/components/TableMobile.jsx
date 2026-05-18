import { Fragment, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Collapse, IconButton, Pagination, TextField } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { PiBroomFill } from 'react-icons/pi'
import NoRegisterTable from '../../../components/TableCustom/NoRegisterTable'

const getCellValue = (column, row) => {
	if (column.accessorFn) return column.accessorFn(row)
	if (column.accessorKey) return row[column.accessorKey]
	return undefined
}

const formatValue = (value) => {
	if (value === null || value === undefined) return ''
	if (value instanceof Date) return `${value.toLocaleDateString()} ${value.toLocaleTimeString()}`
	return String(value)
}

const renderCell = (column, row, index) => {
	const value = getCellValue(column, row)
	if (column.Cell) {
		const CellComponent = column.Cell
		return <CellComponent cell={{ getValue: () => value }} row={{ original: row, index }} />
	}
	return formatValue(value)
}

const ClampedCell = ({ children, lines }) => {
	const [open, setOpen] = useState(false)
	return (
		<Box sx={{ width: '100%' }}>
			<Box
				sx={
					open
						? { wordBreak: 'break-word' }
						: {
							display: '-webkit-box',
							WebkitLineClamp: lines,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							wordBreak: 'break-word'
						}
				}
			>
				{children}
			</Box>
			<Button
				size='small'
				onClick={() => setOpen((v) => !v)}
				endIcon={open ? <ExpandLess /> : <ExpandMore />}
				sx={{ mt: 0.25, p: 0, color: 'inherit', textTransform: 'none', minWidth: 0 }}
			>
				{open ? 'Ver menos' : 'Ver más'}
			</Button>
		</Box>
	)
}

const TableMobile = ({ data = [], columns = [], ...prop }) => {
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)
	const [expanded, setExpanded] = useState({})
	const pageSize = prop.pageSize || 5

	const filteredWithIndex = useMemo(() => {
		const indexed = data.map((row, index) => ({ row, index }))
		const q = search.trim().toLowerCase()
		if (!q) return indexed
		return indexed.filter(({ row }) =>
			columns.some((col) => formatValue(getCellValue(col, row)).toLowerCase().includes(q))
		)
	}, [data, columns, search])

	const pageCount = Math.max(1, Math.ceil(filteredWithIndex.length / pageSize))
	const currentPage = Math.min(page, pageCount)
	const visible = prop.pagination
		? filteredWithIndex.slice((currentPage - 1) * pageSize, currentPage * pageSize)
		: filteredWithIndex

	const visibleCols = columns.filter((c) => !c.mobileHidden)
	const baseCols = visibleCols.filter((c) => !c.mobileExpandable)
	const expandableCols = visibleCols.filter((c) => c.mobileExpandable)
	const baseGroups = baseCols.reduce((acc, col) => {
		if (col.mobileJoinPrev !== undefined && acc.length > 0) {
			acc[acc.length - 1].push({ col, sep: col.mobileJoinPrev })
		} else {
			acc.push([{ col, sep: '' }])
		}
		return acc
	}, [])

	const toggleExpanded = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))

	const tableLike = {
		getState: () => ({ globalFilter: search }),
		getRowModel: () => ({ rows: filteredWithIndex.map(({ index }) => ({ index })) }),
	}

	return (
		<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
			<Box
				sx={{
					display: 'flex',
					gap: 1,
					alignItems: 'center',
					p: 1,
					borderRadius: 1,
					...prop.toolbarClass,
				}}
			>
				<TextField
					size='small'
					fullWidth
					placeholder='Escriba su busqueda'
					value={search}
					onChange={(e) => {
						setSearch(e.target.value)
						setPage(1)
					}}
				/>
				{prop.getPage && prop.checkAlert && (
					<IconButton
						onClick={() => prop.getPage(tableLike, prop.priority)}
						title='Limpiar alertas'
						sx={{
							'&:hover': { backgroundColor: '#ecec97' },
							background: 'yellow',
							color: 'black',
						}}
					>
						<PiBroomFill />
					</IconButton>
				)}
			</Box>

			{visible.length === 0 ? (
				<NoRegisterTable />
			) : (
				visible.map(({ row, index }) => {
					const highlighted = prop.ChangeColorRow?.({ original: row, index })
					const isOpen = !!expanded[index]
					return (
						<Card
							key={index}
							sx={{
								backgroundColor: highlighted ? 'yellow' : 'rgba(209, 213, 219, 0.31)',
								color: highlighted ? 'black' : undefined,
								boxShadow: 1,
							}}
						>
							<CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
								{baseGroups.map((group, gi) => (
									<Box key={gi} sx={{ py: 0.5, wordBreak: 'break-word', fontSize: '14px' }}>
										{group.map(({ col, sep }, ci) => {
											const content = renderCell(col, row, index)
											return (
												<Fragment key={col.id || col.accessorKey}>
													{ci > 0 && sep}
													{col.mobileLineClamp ? (
														<ClampedCell lines={col.mobileLineClamp}>{content}</ClampedCell>
													) : (
														content
													)}
												</Fragment>
											)
										})}
									</Box>
								))}
								{expandableCols.length > 0 && (
									<>
										<Button
											size='small'
											onClick={() => toggleExpanded(index)}
											endIcon={isOpen ? <ExpandLess /> : <ExpandMore />}
											sx={{ mt: 0.5, p: 0, color: 'inherit', textTransform: 'none', minWidth: 0 }}
										>
											{isOpen ? 'Ver menos' : 'Ver más'}
										</Button>
										<Collapse in={isOpen} unmountOnExit>
											{expandableCols.map((column) => (
												<Box key={column.id || column.accessorKey} sx={{ pt: 0.5, wordBreak: 'break-word' }}>
													{renderCell(column, row, index)}
												</Box>
											))}
										</Collapse>
									</>
								)}
							</CardContent>
						</Card>
					)
				})
			)}

			{prop.pagination && pageCount > 1 && (
				<Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
					<Pagination count={pageCount} page={currentPage} onChange={(_, value) => setPage(value)} size='small' />
				</Box>
			)}
		</Box>
	)
}

export default TableMobile
