import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { recentlyViewedBoardsModal } from '~/models/recentlyViewedBoardsModal'
import ApiError from '~/utils/ApiError'

/* eslint-disable no-useless-catch */
const recentlyViewedBoards = async (reqBody) => {
	try {
		const dataId = { ...reqBody }

		const createRecentlyViewedBoards = await recentlyViewedBoardsModal.recentlyViewedBoards(dataId)

		const getNewViewedBoards = await boardModel.findOneById(createRecentlyViewedBoards.boardId)

		return getNewViewedBoards
	} catch (error) {
		throw error
	}
}

const getRecentViewedById = async (userId) => {
	try {
		const allRecentViewedBoard = await recentlyViewedBoardsModal.getRecentViewedById(userId)

		if (!allRecentViewedBoard) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Board is Empty')
		}
		return allRecentViewedBoard
	} catch (error) {
		throw error
	}
}

export const recentlyViewedBoardsService = {
	recentlyViewedBoards,
	getRecentViewedById,
}
