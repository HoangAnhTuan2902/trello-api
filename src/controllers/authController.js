import { StatusCodes } from 'http-status-codes';
import { authService } from '~/services/authService';
import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';

const register = async (req, res, next) => {
	try {
		await authService.register(req.body);

		res.status(StatusCodes.CREATED).json({
			success: true,
			status: StatusCodes.CREATED,
			message: 'Register successfully',
		});
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	console.log('res', req.cookies.access_token);

	try {
		const loginUser = await authService.login(req.body);

		const payload = {
			payload: loginUser.username,
			email: loginUser.email,
		};

		const accessToken = jwt.sign(payload, env.JWT_SECRET, {
			expiresIn: '1d',
		});

		// thiết lập cookie HTTP-Only
		res.cookie('access_token', accessToken, {
			httpOnly: true,
			secure: env.BUILD_MODE === 'dev', // only use secure in production environment
			sameSite: 'strict', // protect against CSRF
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		});

		res.status(StatusCodes.OK).json({
			success: true,
			status: StatusCodes.OK,
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
