/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express';
import exitHook from 'async-exit-hook';
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb';
import { env } from '~/config/environment';
import { APIs_V1 } from '~/routes/v1';

const START_SERVER = () => {
	const app = express();

	//enable req.body json data
	app.use(express.json());

	//use APIs_V1
	app.use('/v1', APIs_V1);

	app.listen(env.APP_PORT, env.APP_HOST, () => {
		// eslint-disable-next-line no-console
		console.log(
			`3. Hi ${env.AUTHOR}, Back-End Server is running successfully at: http://${env.APP_HOST}:${env.APP_PORT}/`,
		);
	});

	// thực hiện cleanup trước khi dừng server
	//
	exitHook(() => {
		console.log('4. Server is shutting down...');
		CLOSE_DB();
	});
};

// chỉ khi kết nối đến batabase thành công thì mới chạy server back-end
// Immediately-Invoked / Anonymous Async function (IIFE)
(async () => {
	try {
		console.log('1. Connecting to MongoDB Cloud Atlas...');
		await CONNECT_DB();
		console.log('2. Connected to MongoDB Cloud Atlas!');
		//khởi động server back-end sau khi connect database thành công
		START_SERVER();
	} catch (error) {
		console.error('Error connecting to MongoDB', error);
		process.exit(0);
	}
})();
