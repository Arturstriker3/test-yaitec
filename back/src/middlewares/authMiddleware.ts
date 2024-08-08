import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from "../helpers/api-errors";
import { userRepository } from "../repositories/userRepositories";

type JwtPayload = {
    id: number;
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return next(new UnauthorizedError('Not Authorized'));
    }

    const token = authorization.split(' ')[1];

    const { id } = jwt.verify(token, process.env.JWT_SECRET ?? '') as JwtPayload;

    const user = await userRepository.findOneBy({ id });

    if (!user) {
        return next(new UnauthorizedError('Not Authorized'));
    }

    const { password: _, ...loggedUser } = user;

    req.user = loggedUser;

    next();
}