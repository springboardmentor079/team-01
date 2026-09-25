const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({
				success: false,
				message: 'No token provided',
			});
		}

		const token = authHeader.split(' ')[1];

		try {
			req.user = jwt.verify(token, process.env.JWT_SECRET);
			return next();
		} catch (error) {
			return res.status(401).json({
				success: false,
				message: 'Invalid or expired token',
			});
		}
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: 'Invalid or expired token',
		});
	}
};

module.exports = { protect };
