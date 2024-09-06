/* eslint-disable no-useless-catch */
import { boardModel } from '~/models/boardModel';
import { columnModel } from '~/models/columnModel';

const createNew = async (reqBody) => {
	try {
		const newColumn = { ...reqBody };

		// gọi tới tầng Model để xử lý lưu bản ghi newColumn vào trong Database
		const createdColumn = await columnModel.createNew(newColumn);

		// lấy bản ghi vừa tạo thành công, trả về cho frontend
		const getNewColumn = await columnModel.findOneById(
			createdColumn.insertedId,
		);

		if (getNewColumn) {
			getNewColumn.cards = [];

			// cập nhật mảng columnOrderIds của collection board
			await boardModel.pushColumnOrderIds(getNewColumn);
		}

		//trả kết quả về, trong Service luôn có return
		return getNewColumn;
	} catch (error) {
		throw error;
	}
};

const update = async (columnId, reqBody) => {
	try {
		const updateData = { ...reqBody, updatedAt: Date.now() };
		// gọi tới tầng Model để xử lý lưu bản ghi newColumn vào trong Database
		const updatedColumn = await columnModel.update(columnId, updateData);

		//trả kết quả về, trong Service luôn có return
		return updatedColumn;
	} catch (error) {
		throw error;
	}
};

export const columnService = {
	createNew,
	update,
};
