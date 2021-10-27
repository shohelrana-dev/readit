import {Request, Response} from 'express';

export default async (_: Request, res: Response) => {
    return res.status(404).json({
        success: false,
        message: '404 Not found'
    });
};