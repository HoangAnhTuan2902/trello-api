import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
	try {
		console.log('req.body', req.body)

		// điều hướng dữ liệu sang service
		const createdBoard = await boardService.createNew(req.body)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.CREATED).json({
			success: true,
			status: StatusCodes.CREATED,
			message: 'Create board successfully',
			createdBoard,
		})
	} catch (error) {
		next(error)
	}
}

const getAll = async (req, res, next) => {
	try {
		const allBoard = await boardService.getAll()

		res.status(StatusCodes.OK).json(allBoard)
	} catch (error) {
		next(error)
	}
}

const getDetails = async (req, res, next) => {
	try {
		console.log('req.params', req.params)
		const boardId = req.params.id

		// điều hướng dữ liệu sang service
		const board = await boardService.getDetails(boardId)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.OK).json(board)
	} catch (error) {
		next(error)
	}
}

const update = async (req, res, next) => {
	try {
		const boardId = req.params.id

		// điều hướng dữ liệu sang service
		const updatedBoard = await boardService.update(boardId, req.body)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.OK).json(updatedBoard)
	} catch (error) {
		next(error)
	}
}
const moveCardToDifferentColumn = async (req, res, next) => {
	try {
		// điều hướng dữ liệu sang service
		const result = await boardService.moveCardToDifferentColumn(req.body)

		//có kết quả thì trả về phía client
		res.status(StatusCodes.OK).json(result)
	} catch (error) {
		next(error)
	}
}

export const boardController = {
	createNew,
	getDetails,
	update,
	moveCardToDifferentColumn,
	getAll,
}
