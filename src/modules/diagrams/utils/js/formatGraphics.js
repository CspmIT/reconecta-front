export const sunburstData = (data) => {
	const orderData = data.map((item) => {
		if (item.type !== 1) {
			return item
		}
		const dataSorted = {
			name: item.name,
			type: item.type,
			unit: item.unit,
			tree: buildTree(item.variables),
		}
		return dataSorted
	})
	return orderData
}

const buildTree = (nodes, parentId = null) => {
	return nodes
		.filter((node) => node.id_parent === parentId)
		.map((node) => {
			const dataBuild = {
				name: node.name,
				children: buildTree(nodes, node.id),
			}
			if (node.color !== null) {
				dataBuild.itemStyle = { color: node.color }
			}
			if (node.value !== null) {
				dataBuild.value = node.value
			}
			if (node.equipments?.equipmentmodels) {
				dataBuild.topic = {
					serial: node.equipments.serial,
					brand: node.equipments.equipmentmodels.name.toLowerCase(),
					version: node.equipments.equipmentmodels.brand.toLowerCase(),
				}
			}
			return dataBuild
		})
}
