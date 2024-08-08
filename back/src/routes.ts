import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { authMiddleware } from "./middlewares/authMiddleware";

const routes = Router();
const protectedRoutes = Router();

// Public
routes.post('/user', new UserController().create);
routes.post('/login', new UserController().login);

protectedRoutes.use(authMiddleware);

// Protected
protectedRoutes.get('/profile', new UserController().getProfile);

routes.use(protectedRoutes);

export default routes;