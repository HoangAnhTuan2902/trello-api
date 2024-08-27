/* eslint-disable no-useless-catch */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { slugify } from '~/utils/formatters';

const createNew = async (reqBody) => {
	try {
		// xử lý logic dữ liệu tùy thuộc đặc thù dự án
		const newBoard = { ...reqBody, slug: slugify(reqBody.title) };

		// gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
		//...

		//trả kết quả về, trong Service luôn có return
		return newBoard;
	} catch (error) {
		throw error;
	}
};

export const boardService = {
	createNew,
};
