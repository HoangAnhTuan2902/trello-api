import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
	const correctCondition = Joi.object({
		title: Joi.string().required().min(3).max(50).trim().strict(),
		description: Joi.string().required().min(3).max(255).trim().strict(),
		type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
		avatar: Joi.string().uri().required(),
	})
	try {
		await correctCondition.validateAsync(req.body, { abortEarly: false })
		next()
	} catch (error) {
		const errorMessage = new Error(error).message
		const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
		next(customError)
	}
}

const deleteWorkSpace = async (req, res, next) => {
	const correctCondition = Joi.object({
		id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
	})
	try {
		await correctCondition.validateAsync(req.params)
		// đưa request đến Controller sau khi đã validate thành công
		next()
	} catch (error) {
		const errorMessage = new Error(error).message
		const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
		next(customError)
	}
}

export const workSpaceValidation = { createNew, deleteWorkSpace }
