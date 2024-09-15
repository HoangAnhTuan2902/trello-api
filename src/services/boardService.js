/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'

import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
	try {
		// xử lý logic dữ liệu tùy thuộc đặc thù dự án
		const newBoard = { ...reqBody, slug: slugify(reqBody.title) }

		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		const createdBoard = await boardModel.createNew(newBoard)

		// lấy bản ghi vừa tạo thành công, trả về cho frontend
		const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

		//trả kết quả về, trong Service luôn có return
		return getNewBoard
	} catch (error) {
		throw error
	}
}

const getDetails = async (boardId) => {
	try {
		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		const board = await boardModel.getDetails(boardId)
		if (!board) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
		}

		const resBoard = cloneDeep(board)
		// đưa card vào từng column
		resBoard.columns.forEach((column) => {
			column.cards = resBoard.cards.filter(
				// .equals là phương thức của MongoDB
				(card) => card.columnId.equals(column._id),

				// (card) => card.columnId.toString() === column._id.toString(),
			)
		})

		// xóa mảng cards ở board ban đầu
		delete resBoard.cards

		//trả kết quả về, tronboarg Service luôn có return
		return resBoard
	} catch (error) {
		throw error
	}
}

const getAll = async () => {
	try {
		const allBoard = await boardModel.getAll()

		if (!allBoard) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Board is Empty')
		}
		return allBoard
	} catch (error) {
		throw error
	}
}

const update = async (boardId, reqBody) => {
	try {
		const updateData = { ...reqBody, updatedAt: Date.now() }
		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		const updatedBoard = await boardModel.update(boardId, updateData)

		//trả kết quả về, trong Service luôn có return
		return updatedBoard
	} catch (error) {
		throw error
	}
}

const moveCardToDifferentColumn = async (reqBody) => {
	try {
		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database

		// B1: cập nhật lại cardOrderIds của column cũ chứa nó
		await columnModel.update(reqBody.prevColumnId, {
			cardOrderIds: reqBody.prevCardOrderIds,
			updatedAt: Date.now(),
		})
		// B2: cập nhật lại cardOrderIds của column mới chứa nó
		await columnModel.update(reqBody.nextColumnId, {
			cardOrderIds: reqBody.nextCardOrderIds,
			updatedAt: Date.now(),
		})
		// B3: cập nhật lại columnId của card được kéo
		await cardModel.update(reqBody.currentCardId, {
			columnId: reqBody.nextColumnId,
		})

		//trả kết quả về, trong Service luôn có return
		return { updateResult: 'success' }
	} catch (error) {
		throw error
	}
}

export const boardService = {
	getDetails,
	createNew,
	update,
	moveCardToDifferentColumn,
	getAll,
}
