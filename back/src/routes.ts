import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { BookController } from './controllers/BookController';
import { authMiddleware } from './middlewares/authMiddleware';
import upload from './middlewares/uploadMiddleware';


const routes = Router();
const protectedRoutes = Router();

// Public
routes.post('/register', new UserController().create);
routes.post('/login', new UserController().login);

// Rota para upload de livros
routes.post('/book', upload.single('file'), new BookController().create);

routes.get('/book/:id', new BookController().getOneBookById);

routes.get('/books', new BookController().getPaginatedBooks);

routes.delete('/book/:id', new BookController().deleteBook);

protectedRoutes.use(authMiddleware);

// Protected
protectedRoutes.get('/profile', new UserController().getProfile);

routes.use(protectedRoutes);

export default routes;