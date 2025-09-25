import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Member from '../models/memberModel.js';

export const isAuthenticatedUser = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        const error = new Error('Not authorized, no token');
        error.statusCode = 401;
        return next(error);
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        let userEntity = await User.findById(decodedData.id) || await Member.findById(decodedData.id);

        if (!userEntity) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            return next(error);
        }

        if (userEntity.isBlocked && new Date() < new Date(userEntity.blockedUntil)) {
            const error = new Error(`Your account is blocked until ${new Date(userEntity.blockedUntil).toLocaleString()}. Reason: ${userEntity.blockReason}`);
            error.statusCode = 403;
            return next(error);
        }

        req.user = userEntity;
        next();

    } catch (err) {
        const error = new Error('Not authorized, token failed');
        error.statusCode = 401;
        return next(error);
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user.role || req.user.designation;

        if (!roles.includes(userRole)) {
            const error = new Error(`Role: ${userRole} is not allowed to access this resource`);
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};
