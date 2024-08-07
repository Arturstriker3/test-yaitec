const express = require('express');
const api = express();
import { AppDataSource } from "./data-source";
import { errorMiddleware } from "./middlewares/error";
import routes from './routes';

AppDataSource.initialize().then(() => {

    api.use(express.json());

    api.use(routes);

    api.use(errorMiddleware);
    api.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
});