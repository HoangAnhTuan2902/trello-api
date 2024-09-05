/* eslint-disable no-useless-catch */
import { cloneDeep } from 'lodash';
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
		const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);

		//trả kết quả về, trong Service luôn có return
		return getNewBoard;
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

		const resBoard = cloneDeep(board);
		// đưa card vào từng column
		resBoard.columns.forEach((column) => {
			column.cards = resBoard.cards.filter(
				// .equals là phương thức của MongoDB
				(card) => card.columnId.equals(column._id),

				// (card) => card.columnId.toString() === column._id.toString(),
			);
		});

		// xóa mảng cards ở board ban đầu
		delete resBoard.cards;

		//trả kết quả về, trong Service luôn có return
		return resBoard;
	} catch (error) {
		throw error;
	}
};

const update = async (boardId, reqBody) => {
	try {
		const updateData = { ...reqBody, updatedAt: Date.now() };
		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		const updatedBoard = await boardModel.update(boardId, updateData);

		//trả kết quả về, trong Service luôn có return
		return updatedBoard;
	} catch (error) {
		throw error;
	}
};

export const boardService = {
	getDetails,
	createNew,
	update,
};
