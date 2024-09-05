/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel';

const createNew = async (reqBody) => {
	try {
		const newCard = { ...reqBody };

		// gọi tới tầng Model để xử lý lưu bản ghi newCard vào trong Database
		const createdCard = await cardModel.createNew(newCard);

		// lấy bản ghi vừa tạo thành công, trả về cho frontend
		const getNewCard = await cardModel.findOneById(createdCard.insertedId);

		//trả kết quả về, trong Service luôn có return
		return getNewCard;
	} catch (error) {
		throw error;
	}
};

export const cardService = {
	createNew,
};
