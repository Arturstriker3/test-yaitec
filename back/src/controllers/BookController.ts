import { NextFunction, Request, Response } from 'express';
import { bookRepository } from "../repositories/bookRepositories";
import { BadRequestError, NotFoundError } from '../helpers/api-errors';
import multer from 'multer';

const storage = multer.memoryStorage();
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
*                   example: "JVBERi0xLjQKJ..."
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

        const fileBase64 = file.buffer.toString('base64');

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

/**
* @swagger
* /book/{id}:
*   get:
*     tags:
*       - Books
*     summary: Get a book by ID
*     description: Retrieve the details of a book by its ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the book to retrieve
*         schema:
*           type: integer
*           example: 1
*     responses:
*       200:
*         description: Book details retrieved successfully
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
*                   example: "JVBERi0xLjQKJ..."
*                   description: "Base64 encoded PDF file stored in the database"
*       404:
*         description: Book not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Book not found"
*/
    async getOneBookById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const book = await bookRepository.findOneBy({ id: Number(id) });

        if (!book) {
            return next(new NotFoundError('Book not found'));
        }

        return res.status(200).json(book);
    }

/**
* @swagger
* /books:
*   get:
*     tags:
*       - Books
*     summary: Get a paginated list of books
*     description: Retrieve a list of books with pagination support
*     parameters:
*       - in: header
*         name: page
*         required: true
*         description: The page number to retrieve
*         schema:
*           type: integer
*           example: 1
*       - in: header
*         name: limit
*         required: true
*         description: The number of books to retrieve per page
*         schema:
*           type: integer
*           example: 10
*     responses:
*       200:
*         description: A paginated list of books
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 totalItems:
*                   type: integer
*                   example: 100
*                 currentPage:
*                   type: integer
*                   example: 1
*                 totalPages:
*                   type: integer
*                   example: 10
*                 books:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       id:
*                         type: integer
*                         example: 1
*                       title:
*                         type: string
*                         example: "Book Title"
*                       author:
*                         type: string
*                         example: "Author Name"
*                       fileBase64:
*                         type: string
*                         example: "JVBERi0xLjQKJ..."
*                         description: "Base64 encoded PDF file stored in the database"
*       400:
*         description: Bad request
*/
    async getPaginatedBooks(req: Request, res: Response, next: NextFunction) {
        const page = parseInt(req.headers['page'] as string);
        const limit = parseInt(req.headers['limit'] as string);

        if (isNaN(page) || page <= 0) {
            return next(new BadRequestError('Invalid page number'));
        }

        if (isNaN(limit) || limit <= 0) {
            return next(new BadRequestError('Invalid limit number'));
        }

        const [books, totalItems] = await bookRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalPages = Math.ceil(totalItems / limit);

        const booksWithoutFile = books.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
        }));

        return res.status(200).json({
            totalItems,
            currentPage: page,
            totalPages,
            books: booksWithoutFile,
        });
    }

/**
* @swagger
* /book/{id}:
*   delete:
*     tags:
*       - Books
*     summary: Delete a book by ID
*     description: Delete a specific book from the database using its ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the book to delete
*         schema:
*           type: integer
*           example: 1
*     responses:
*       200:
*         description: Book deleted successfully
*         content:
*           application/json:
*             schema:
*               type: string
*               example: "Book deleted successfully"
*       404:
*         description: Book not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Book not found"
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Error deleting book"
*/
    async deleteBook(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const book = await bookRepository.findOneBy({ id: Number(id) });

        if (!book) {
            return next(new NotFoundError('Book not found'));
        }

        const deleted = await bookRepository.delete(book.id);

        if (!deleted) {
            return next(new Error('Error deleting book'));
        }

        return res.status(200).json('Book deleted successfully');
    }
}