import { NextFunction, Request, Response } from "express";
import { userRepository } from "../repositories/userRepositories";
import { BadRequestError, UnauthorizedError } from "../helpers/api-errors";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserController {

    /**
     * @swagger
     * tags:
     *   - name: Authentication
     *     description: Endpoints associated to user authentication
     */

    /**
     * @swagger
     * tags:
     *   - name: User Profile
     *     description: Endpoints associated to user profile
     */

    /**
     * @swagger
     * /user:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Create a new user
     *     description: Create a new user with name, email and password
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: John Doe
     *               email:
     *                 type: string
     *                 example: john.doe@example.com
     *               password:
     *                 type: string
     *                 example: password123
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 name:
     *                   type: string
     *                   example: John Doe
     *                 email:
     *                   type: string
     *                   example: john.doe@example.com
     *       400:
     *         description: User already exists
     */

    async create(req: Request, res: Response, next: NextFunction) {
        const { name, email, password } = req.body;

        const userExist = await userRepository.findOneBy({ email });

        if (userExist) {
            return next(new BadRequestError('User already exists'));
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            name,
            email,
            password: hashPassword
        });

        await userRepository.save(newUser);

        const {password: _, ...user} = newUser;

        return res.status(201).json(user);
    }

    /**
     * @swagger
     * /login:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Authenticates a user and returns a JWT token
     *     description: Authenticates the user in and returns a JWT token for acess others routes
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: john.doe@example.com
     *               password:
     *                 type: string
     *                 example: password123
     *     responses:
     *       200:
     *         description: User successfully authenticated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
    *                     user:
    *                       type: string
    *                       example: john.doe@example.com
    *                     token:
    *                       type: string
    *                       example: jwt-token
     *       400:
     *         description: E-mail or Password invalid
     */

    async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const user = await userRepository.findOneBy({ email });

        if (!user) {
            return next(new BadRequestError('E-mail or Password invalid'));
        }

        const verifyPassword = await bcrypt.compare(password, user.password);

        if (!verifyPassword) {
            return next(new BadRequestError('E-mail or Password invalid'));
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

    /**
     * @swagger
     * /profile:
     *   get:
     *     tags:
     *       - User Profile
     *     summary: Returns the authenticated user's profile
     *     description: Returns the profile information of the user who is authenticated
     *     security:
     *       - jwtAuth: []
     *     responses:
     *       200:
     *         description: Profile info returned successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 name:
     *                   type: string
     *                   example: John Doe
     *                 email:
     *                   type: string
     *                   example: john.doe@example.com
     *       401:
     *         description: Not authorized
     */

    async getProfile(req: Request, res: Response) {
        return res.status(200).json(req.user);
    }
}