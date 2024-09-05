import { StatusCodes } from 'http-status-codes';
import { columnService } from '~/services/columnService';

const createNew = async (req, res, next) => {
	try {
		console.log('req.body', req.body);

		// điều hướng dữ liệu sang service
		const createdColumn = await columnService.createNew(req.body);

		//có kết quả thì trả về phía client
		res.status(StatusCodes.CREATED).json(createdColumn);
	} catch (error) {
		next(error);
	}
};

export const columnController = {
	createNew,
};
