import { StatusCodes } from 'http-status-codes';
import { authService } from '~/services/authService';
import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';

const register = async (req, res, next) => {
	try {
		await authService.register(req.body);

		res.status(StatusCodes.CREATED).json({
			success: true,
			message: 'Register successfully',
		});
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const loginUser = await authService.login(req.body);

		const payload = {
			payload: loginUser.username,
			email: loginUser.email,
		};

		const accessToken = jwt.sign(payload, env.JWT_SECRET, {
			expiresIn: '1d',
		});

		res.status(StatusCodes.OK).json({
			success: true,
			message: 'Login successfully',
			access_token: accessToken,
			user: loginUser,
		});
	} catch (error) {
		next(error);
	}
};

export const authController = {
	login,
	register,
};
