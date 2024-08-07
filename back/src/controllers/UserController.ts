import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepositories";
import { BadRequestError, UnauthorizedError } from "../helpers/api-errors";
import bcryp from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserController {
    async create(req: Request, res: Response) {
        const { name, email, password } = req.body;

        const userExist = await userRepository.findOneBy({ email });

        if (userExist) {
            throw new BadRequestError('User already exists');
        }

        const hashPassword = await bcryp.hash(password, 10);

        const newUser = userRepository.create({
            name,
            email,
            password: hashPassword
        });

        await userRepository.save(newUser);

        const {password: _, ...user} = newUser;

        return res.status(201).json(user);
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await userRepository.findOneBy({ email });

        if (!user) {
            throw new BadRequestError('E-mail or Password invalid');
        }

        const verifyPassword = await bcryp.compare(password, user.password);

        if (!verifyPassword) {
            throw new BadRequestError('E-mail or Password invalid');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? '', {

        expiresIn: '1d'
        });

        const {password: _, ...userLogin} = user;

        return res.status(200).json({
            user: userLogin,
            token: token
        });
    }

    async getProfile(req: Request, res: Response) {
        return res.status(200).json(req.user);
    }
}