import { StatusCodes } from 'http-status-codes'
import { workSpaceService } from '~/services/workSpaceService'

const getAll = async (req, res, next) => {
	try {
		const allWorkSpace = await workSpaceService.getAll()

		res.status(StatusCodes.OK).json(allWorkSpace)
	} catch (error) {
		next(error)
	}
}

const getDetails = async (req, res, next) => {
	try {
		console.log('workSpaceId', workSpaceId)
		const workSpaceId = req.params.id

		const workSpace = await workSpaceService.getDetails(workSpaceId)

		res.status(StatusCodes.OK).json(workSpace)
	} catch (error) {
		next(error)
	}
}

const createNew = async (req, res, next) => {
	try {
		console.log('req.body', req.body)

		const createdWorkSpace = await workSpaceService.createNew(req.body)

		res.status(StatusCodes.CREATED).json({
			success: true,
			status: StatusCodes.CREATED,
			message: 'Create workspace successfully',
			createdWorkSpace,
		})
	} catch (error) {
		next(error)
	}
}

const deleteWorkSpace = async (req, res, next) => {
	try {
		const workSpaceId = req.params.id

		const result = await workSpaceService.deleteWorkSpace(workSpaceId)

		res.status(StatusCodes.OK).json(result)
	} catch (error) {
		next(error)
	}
}

export const workSpaceController = { getAll, createNew, deleteWorkSpace, getDetails }
