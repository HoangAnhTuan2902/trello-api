import { ObjectId } from 'mongodb';
import Joi from 'joi';
import { GET_DB } from '~/config/mongodb';

// define Collection (Name & Schema)

const BOARD_COLLECTION_NAME = 'boards';
const BOARD_COLLECTION_SCHEMA = Joi.object({
	title: Joi.string().required().min(3).max(50).trim().strict(),
	slug: Joi.string().required().min(3).trim().strict(),
	description: Joi.string().required().min(3).max(255).trim().strict(),
	columnOrderIds: Joi.array().items(Joi.string()).default([]),
	createAt: Joi.date().timestamp('javascript').default(Date.now()),
	updatedAt: Joi.date().timestamp('javascript').default(null),
	_destroy: Joi.boolean().default(false),
});

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
		const result = await GET_DB()
			.collection(BOARD_COLLECTION_NAME)
			.findOne({ _id: new ObjectId(id) });
		return result;
	} catch (error) {
		throw new Error(error);
	}
};
export const boardModel = {
	BOARD_COLLECTION_NAME,
	BOARD_COLLECTION_SCHEMA,
	findOneById,
	getDetails,
	createNew,
};
