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
		console.log('loginUser', loginUser);

		const payload = {
			email: loginUser.email,
			fullname: loginUser.fullname,
			username: loginUser.username,
			avartar: 'comming soon',
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

const checkAuth = (req, res) => {
	try {
		const token = req.cookies.access_token;

		if (!token) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				success: false,
				status: StatusCodes.UNAUTHORIZED,
				message: 'User not authenticated',
			});
		}

		const verified = jwt.verify(token, env.JWT_SECRET);
		res.status(StatusCodes.OK).json({
			success: true,
			status: StatusCodes.OK,
			user: verified, // Thông tin người dùng sau khi xác minh JWT
		});
	} catch (error) {
		res.status(StatusCodes.UNAUTHORIZED).json({
			success: false,
			status: StatusCodes.UNAUTHORIZED,
			message: 'Invalid token',
		});
	}
};

export const authController = {
	login,
	register,
	checkAuth,
};
