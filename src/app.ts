// import express, { Application, Request, Response, NextFunction } from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import router from './app/routes';
// import globalErrorHandler from './app/middlewares/globalErrorHandler';
// import httpStatus from 'http-status';

// const app: Application = express();

// app.use(express.json()); // Parse JSON body
// app.use(cookieParser()); // Parse cookies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded HTML form data
// app.use(
//     cors({
//         origin: [
//             'http://localhost:5173',
//             'http://localhost:3000',
//             'https://mehedimehad.vercel.app',
//             'https://managemehedimehad.vercel.app'
//         ], // Allow requests from frontend
//         credentials: true // 👉 Allow sending cookies/credentials
//     })
// );

// app.get('/', (req: Request, res: Response) => {
//     res.send({
//         message: 'Hello from the Health Care Server!'
//     });
// });

// app.use('/api/v1/', router);
// app.use(globalErrorHandler);
// app.use((req: Request, res: Response, next: NextFunction) => {
//     console.log(`🟥 Requested path: ${req.method} ${req.originalUrl}`);

//     res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         message: 'API NOT FOUND',
//         error: {
//             path: req.originalUrl,
//             message: 'Your requested path is not found'
//         }
//     });
// });
// export default app;


import path from 'path';

import cors from 'cors';
import type { Application, NextFunction, Request, Response } from 'express';
import express from 'express';
import httpStatus from 'http-status';
import morgan from 'morgan';

import globalErrorHandler from './app/errors/globalErrorHandler';
import router from './app/routes';


// 🚀 Express App
const app: Application = express();

// 📊 HTTP Logging (Morgan)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // 🛠️ Development-friendly logging
} else {
    app.use(morgan('combined')); // 📁 Production-style logs
}

// 📁 Static Files For CSS
app.use(express.static(path.join(process.cwd(), 'public')));


// 🌐 CORS Configuration (support multiple origins)
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://mehedimehad.vercel.app',
            'https://managemehedimehad.vercel.app'
        ],
        credentials: true,
    }),
);

// 📦 Body parser – apply only when NOT multipart/form-data
app.use((req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
        express.json({ limit: '10mb' })(req, res, () => {
            express.urlencoded({ extended: true })(req, res, next);
        });
    } else {
        next(); // skip body parser for file upload
    }
});

// 📡 API Health Check Search Browser ex: http://10.0.10.62:7090/
app.get('/', (_req: Request, res: Response) => {
    res.status(httpStatus.OK).send(`
  <h1 style="color: green">API Service is running</h1>
  `);
});

// 📡 API Routes
app.use('/api/v1', router);

// Force Error
app.get('/force-error', () => {
    throw new Error('Force Error');
});

// Global Error Handler
app.use(globalErrorHandler);

// 🚫 404 Not Found Handler
app.use((req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'API NOT FOUND!',
        error: {
            path: req.originalUrl,
            message: 'The requested endpoint does not exist.',
        },
    });
});

export default app;
