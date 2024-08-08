import { NextFunction, Request, Response } from 'express';
import { bookRepository } from "../repositories/bookRepositories";
import { BadRequestError } from '../helpers/api-errors';
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage(); // Armazenar na memória para converter em base64
const upload = multer({ storage });

export const uploadMiddleware = upload.single('file');

export class BookController {
    /**
    * @swagger
    * /book:
    *   post:
    *     tags:
    *       - Books
    *     summary: Upload and store a new book
    *     description: Upload a PDF file and store the book information in the database
    *     requestBody:
    *       required: true
    *       content:
    *         multipart/form-data:
    *           schema:
    *             type: object
    *             properties:
    *               title:
    *                 type: string
    *                 example: "Book Title"
    *               author:
    *                 type: string
    *                 example: "Author Name"
    *               file:
    *                 type: string
    *                 format: binary
    *                 description: "PDF file to be uploaded"
    *     responses:
    *       201:
    *         description: Book uploaded successfully
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 id:
    *                   type: integer
    *                   example: 1
    *                 title:
    *                   type: string
    *                   example: "Book Title"
    *                 author:
    *                   type: string
    *                   example: "Author Name"
    *                 fileBase64:
    *                   type: string
    *                   example: "JVBERi0xLjQKJ..."  # Exemplo truncado de base64
    *                   description: "Base64 encoded PDF file stored in the database"
    *       400:
    *         description: Bad request
    */
    async create(req: Request, res: Response, next: NextFunction) {
        const { title, author } = req.body;
        const file = req.file;

        if (!title || !author) {
            return next(new BadRequestError('To register a book you need to send a title and author'));
        }

        if (!file || file.mimetype !== 'application/pdf') {
            return next(new BadRequestError('Only PDF files are allowed'));
        }

        const bookExist = await bookRepository.findOneBy({ title });
        if (bookExist) {
            return next(new BadRequestError('Book already exists'));
        }

        // Converte o arquivo para base64
        const fileBase64 = file.buffer.toString('base64');

        // Cria e salva o novo livro
        const newBook = bookRepository.create({
            title,
            author,
            fileBase64
        });

        await bookRepository.save(newBook);

        return res.status(201).json({
            id: newBook.id,
            title: newBook.title,
            author: newBook.author,
            message: "Book uploaded successfully",
        });
    }
}