import { recloser } from '../../../recloser/board/utils/objects'
export const getRecloser = async (id) => {
	return recloser.filter((item) => item.id == id)
}
