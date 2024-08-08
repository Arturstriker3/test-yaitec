import { NextFunction, Request, Response } from 'express';
import { bookRepository } from "../repositories/bookRepositories";
import { BadRequestError } from '../helpers/api-errors';

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
   *                 fileUrl:
   *                   type: string
   *                   example: "/uploads/book.pdf"
   *       400:
   *         description: Bad request
   */
    async create(req: Request, res: Response, next: NextFunction) {
        const { title, author } = req.body;
        const file = req.file;

        if (!title || !author) {
            return next(new BadRequestError('To register a book you need to send a title and author'));
        }

        if (!file) {
            return next(new BadRequestError('No file uploaded'));
        }

        if (file.mimetype !== 'application/pdf') {
            return next(new BadRequestError('Only PDF files are allowed'));
        }

        const bookExist = await bookRepository.findOneBy({ title });
        if (bookExist) {
            return next(new BadRequestError('Book already exists'));
        }

        const newBook = bookRepository.create({
            title,
            author,
            fileUrl: file.path
        });

        await bookRepository.save(newBook);

        return res.status(201).json(newBook);
    }
}
    