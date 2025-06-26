import { Request, Response, NextFunction } from 'express'

// 404 Not Found handler
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(404).json({
        message: 'API Route Not Found',
        method: req.method,
        path: req.originalUrl,
    })
}
