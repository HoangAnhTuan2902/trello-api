/* eslint-disable no-useless-catch */
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

		//trả kết quả về, trong Service luôn có return
		return getNewColumn;
	} catch (error) {
		throw error;
	}
};

export const columnService = {
	createNew,
};
