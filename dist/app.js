"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const http_status_1 = __importDefault(require("http-status"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Parse JSON body
app.use((0, cookie_parser_1.default)()); // Parse cookies
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded HTML form data
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://mehedimehad.vercel.app',
        'https://managemehedimehad.vercel.app'
    ], // Allow requests from frontend
    credentials: true // 👉 Allow sending cookies/credentials
}));
app.get('/', (req, res) => {
    res.send({
        message: 'Hello from the Health Care Server!'
    });
});
app.use('/api/v1/', routes_1.default);
app.use(globalErrorHandler_1.default);
app.use((req, res, next) => {
    console.log(`🟥 Requested path: ${req.method} ${req.originalUrl}`);
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'API NOT FOUND',
        error: {
            path: req.originalUrl,
            message: 'Your requested path is not found'
        }
    });
});
exports.default = app;
