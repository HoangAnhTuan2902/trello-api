import { StatusCodes } from 'http-status-codes'

import { workSpaceModel } from '~/models/workSpaceModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

/* eslint-disable no-useless-catch */
const getAll = async (userId) => {
	try {
		const allWorkSpace = await workSpaceModel.getAll(userId)

		if (!allWorkSpace) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Workspace is Empty')
		}

		return allWorkSpace
	} catch (error) {
		throw error
	}
}

const createNew = async (reqBody) => {
	try {
		const newWorkSpace = { ...reqBody, slug: slugify(reqBody.title) }
		console.log('newWorkSpace', newWorkSpace)

		const createdWorkSpace = await workSpaceModel.createNew(newWorkSpace)

		const getNewWorkSpace = await workSpaceModel.findOneById(createdWorkSpace.insertedId)

		return getNewWorkSpace
	} catch (error) {
		throw error
	}
}

const deleteWorkSpace = async (workSpaceId) => {
	try {
		const targetWorkSpace = await workSpaceModel.findOneById(workSpaceId)

		if (!targetWorkSpace) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'WorkSpace not found')
		}
		/**
		 *
		 *
		 * còn nữa
		 *
		 */
	} catch (error) {
		throw error
	}
}

const getDetails = async (workSpaceId) => {
	try {
		const workSpace = await workSpaceModel.getDetails(workSpaceId)

		if (!workSpace) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
		}

		return workSpace
	} catch (error) {
		throw error
	}
}

export const workSpaceService = { getAll, createNew, deleteWorkSpace, getDetails }
