//dependencies
import 'reflect-metadata';
import express, {Application} from 'express';
import morgan from 'morgan';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from "path";
import fileUpload from "express-fileupload";


//internal import
import authRoutes from '../api/routes/auth-routes';
import usersRoutes from '../api/routes/users-routes';
import postsRoutes from '../api/routes/posts-routes';
import subsRoutes from '../api/routes/subs-routes';
import votesRoutes from '../api/routes/votes-routes';
import currentUser from "../api/middlware/current-user";
import notFound from "../api/middlware/not-found";

//Application
const app: Application = express();

//config
dotenv.config();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/../../public')));
app.use(cookieParser());
app.use(fileUpload());
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200
}));

//base routes
app.use('/api/v1/auth', currentUser, authRoutes);
app.use('/api/v1/users', currentUser, usersRoutes);
app.use('/api/v1/posts', currentUser, postsRoutes);
app.use('/api/v1/subs', currentUser, subsRoutes);
app.use('/api/v1/votes', currentUser, votesRoutes);

// handle 404 not found error
app.use(notFound);

export default app;