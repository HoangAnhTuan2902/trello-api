import { StatusCodes } from 'http-status-codes';
import { authService } from '~/services/authService';

const register = async (req, res, next) => {
	try {
		const registerUser = await authService.register(req.body);

		res.status(StatusCodes.CREATED).json(registerUser);
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const loginUser = await authService.login(req.body);

		res.status(StatusCodes.OK).json({
			success: true,
			message: 'Login successfully',
			data: loginUser,
		});
	} catch (error) {
		next(error);
	}
};

export const authController = {
	login,
	register,
};
