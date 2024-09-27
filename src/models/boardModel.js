import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { cardModel } from './cardModel'
import { columnModel } from './columnModel'

// define Collection (Name & Schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
	userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
	workSpaceId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
	title: Joi.string().required().min(3).max(50).trim().strict(),
	slug: Joi.string().required().min(3).trim().strict(),
	description: Joi.string().required().min(3).max(255).trim().strict(),
	type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
	bgImage: Joi.string().uri().required(),
	columnOrderIds: Joi.array().items(Joi.string()).default([]),
	createAt: Joi.date().timestamp('javascript').default(Date.now()),
	viewedAt: Joi.date().timestamp('javascript').default(null),
	updatedAt: Joi.date().timestamp('javascript').default(null),
	_destroy: Joi.boolean().default(false),
	favourite: Joi.boolean().valid(true, false).default(false),
})

const INVALID_UPDATE_FIELDS = ['_id', 'createAt']

// thêm các dữ liệu mặc định cho các trường cần thiết trước khi tạo mới bản ghi
const validateBeforeCreate = async (data) => {
	return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
		abortEarly: false,
	})
}

const createNew = async (data) => {
	try {
		const validData = await validateBeforeCreate(data)

		const newBoardToAdd = {
			...validData,
			workSpaceId: new ObjectId(validData.workSpaceId),
			userId: new ObjectId(validData.userId),
		}

		const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(newBoardToAdd)
		return createdBoard
	} catch (error) {
		throw new Error(error)
	}
}

const findOneById = async (id) => {
	try {
		const result = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.findOne({ _id: new ObjectId(id) })
		return result
	} catch (error) {
		throw new Error(error)
	}
}

// query tổng hợp (aggregate) để lấy toàn bộ columns thuộc về Board
const getDetails = async (id) => {
	try {
		const result = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.aggregate([
				{
					$match: {
						_id: new ObjectId(id),
						_destroy: false,
					},
				},
				{
					$lookup: {
						from: columnModel.COLUMN_COLLECTION_NAME,
						localField: '_id',
						foreignField: 'boardId',
						as: 'columns',
					},
				},
				{
					$lookup: {
						from: cardModel.CARD_COLLECTION_NAME,
						localField: '_id',
						foreignField: 'boardId',
						as: 'cards',
					},
				},
			])
			.toArray()
		return result[0] || null
	} catch (error) {
		throw new Error(error)
	}
}

const getAll = async (userId) => {
	const result = GET_DB()
		.collection(BOARD_COLLECTION_NAME)
		.find({ userId: new ObjectId(userId) })
		.toArray()

	return result
}

// push 1 giá trị columnId vào cuối mảng columnOrderIds của board
const pushColumnOrderIds = async (column) => {
	try {
		const result = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.findOneAndUpdate(
				{ _id: new ObjectId(column.boardId) },
				{ $push: { columnOrderIds: new ObjectId(column._id) } },
				{ returnDocument: 'after' },
			)

		return result
	} catch (error) {
		throw new Error(error)
	}
}
/** lấy 1 phần từ columnId ra khỏi mảng columnOrderIds
 * dùng $pull trong MongoDB để kéo 1 phần tử ra khỏi mảng
 */
const pullColumnOrderIds = async (column) => {
	try {
		const result = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.findOneAndUpdate(
				{ _id: new ObjectId(column.boardId) },
				{ $pull: { columnOrderIds: new ObjectId(column._id) } },
				{ returnDocument: 'after' },
			)

		return result
	} catch (error) {
		throw new Error(error)
	}
}

const update = async (boardId, updateData) => {
	try {
		// lọc những field không cho phép cập nhật
		Object.keys(updateData).forEach((fieldName) => {
			if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
				delete updateData[fieldName]
			}
		})

		// biến đổi dữ liệu liên quan tới ObjectId
		if (updateData.columnOrderIds) {
			updateData.columnOrderIds = updateData.columnOrderIds?.map((cardId) => new ObjectId(cardId))
		}

		const result = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.findOneAndUpdate({ _id: new ObjectId(boardId) }, { $set: updateData }, { returnDocument: 'after' })

		return result
	} catch (error) {
		throw new Error(error)
	}
}

const updateViewed = async (boardId) => {
	try {
		const result = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.findOneAndUpdate({ _id: new ObjectId(boardId) }, { $set: { viewedAt: Date.now() } }, { returnDocument: 'after' })

		return result
	} catch (error) {
		throw new Error(error)
	}
}

const addFavourite = async (boardId, updateData) => {
	try {
		// lọc những field không cho phép cập nhật
		Object.keys(updateData).forEach((fieldName) => {
			if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
				delete updateData[fieldName]
			}
		})

		const result = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.findOneAndUpdate({ _id: new ObjectId(boardId) }, { $set: updateData }, { returnDocument: 'after' })

		return result
	} catch (error) {
		throw new Error(error)
	}
}

export const boardModel = {
	BOARD_COLLECTION_SCHEMA,
	BOARD_COLLECTION_NAME,
	pushColumnOrderIds,
	pullColumnOrderIds,
	updateViewed,
	addFavourite,
	findOneById,
	getDetails,
	createNew,
	getAll,
	update,
}
