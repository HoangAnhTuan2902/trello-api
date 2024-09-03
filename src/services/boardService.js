/* eslint-disable no-useless-catch */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { slugify } from '~/utils/formatters';
import { boardModel } from '~/models/boardModel';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const createNew = async (reqBody) => {
	try {
		// xử lý logic dữ liệu tùy thuộc đặc thù dự án
		const newBoard = { ...reqBody, slug: slugify(reqBody.title) };

		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		const createdBoard = await boardModel.createNew(newBoard);

		// lấy bản ghi vừa tạo thành công, trả về cho frontend
		const getNewboard = await boardModel.findOneById(createdBoard.insertedId);

		//trả kết quả về, trong Service luôn có return
		return getNewboard;
	} catch (error) {
		throw error;
	}
};

const getDetails = async (boardId) => {
	try {
		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		const board = await boardModel.getDetails(boardId);
		if (!board) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found');
		}

		//trả kết quả về, trong Service luôn có return
		return board;
	} catch (error) {
		throw error;
	}
};
export const boardService = {
	getDetails,
	createNew,
};
