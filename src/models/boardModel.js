import { ObjectId } from 'mongodb';
import Joi from 'joi';
import { GET_DB } from '~/config/mongodb';
import { BOARD_TYPES } from '~/utils/constants';
import { columnModel } from './columnModel';
import { cardModel } from './cardModel';

// define Collection (Name & Schema)

const BOARD_COLLECTION_NAME = 'boards';
const BOARD_COLLECTION_SCHEMA = Joi.object({
	title: Joi.string().required().min(3).max(50).trim().strict(),
	slug: Joi.string().required().min(3).trim().strict(),
	description: Joi.string().required().min(3).max(255).trim().strict(),
	type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
	columnOrderIds: Joi.array().items(Joi.string()).default([]),
	createAt: Joi.date().timestamp('javascript').default(Date.now()),
	updatedAt: Joi.date().timestamp('javascript').default(null),
	_destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ['_id', 'createAt'];

// thêm các dữ liệu mặc định cho các trường cần thiết trước khi tạo mới bản ghi
const validateBeforeCreate = async (data) => {
	return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
		abortEarly: false,
	});
};

const createNew = async (data) => {
	try {
		const validData = await validateBeforeCreate(data);
		const createdBoard = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.insertOne(validData);
		return createdBoard;
	} catch (error) {
		throw new Error(error);
	}
};

const findOneById = async (id) => {
	try {
		const result = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.findOne({ _id: new ObjectId(id) });
		return result;
	} catch (error) {
		throw new Error(error);
	}
};

// query tổng hợp (aggregate) để lấy toàn bộ columns thuộc về Board
const getDetails = async (id) => {
	try {
		// const result = await GET_DB()
		// 	.collection(BOARD_COLLECTION_NAME)
		// 	.findOne({ _id: new ObjectId(id) });
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
			.toArray();
		return result[0] || null;
	} catch (error) {
		throw new Error(error);
	}
};

// push 1 giá trị columnId vào cuối mảng columnOrderIds của board
const pushColumnOrderIds = async (column) => {
	try {
		const result = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.findOneAndUpdate(
				{ _id: new ObjectId(column.boardId) },
				{ $push: { columnOrderIds: new ObjectId(column._id) } },
				{ returnDocument: 'after' },
			);

		return result;
	} catch (error) {
		throw new Error(error);
	}
};

const update = async (boardId, updateData) => {
	try {
		// lọc những field không cho phép cập nhật
		Object.keys(updateData).forEach((fieldName) => {
			if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
				delete updateData[fieldName];
			}
		});

		// console.log('updateData', updateData);

		const result = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.findOneAndUpdate(
				{ _id: new ObjectId(boardId) },
				{ $set: updateData },
				{ returnDocument: 'after' },
			);

		return result;
	} catch (error) {
		throw new Error(error);
	}
};

export const boardModel = {
	BOARD_COLLECTION_NAME,
	BOARD_COLLECTION_SCHEMA,
	pushColumnOrderIds,
	getDetails,
	findOneById,
	createNew,
	update,
};
