"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const seedSuperAdmin_1 = __importDefault(require("./db/seedSuperAdmin"));
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 🟢 Start the server
            const port = config_1.default.port;
            server = app_1.default.listen(port, () => __awaiter(this, void 0, void 0, function* () {
                yield (0, seedSuperAdmin_1.default)();
                console.log(`🚀 Server is running on port ${port}`);
            }));
            // 🔐 Handle Uncaught Exceptions
            process.on('uncaughtException', (error) => {
                console.error('❌ Uncaught Exception:', error);
                shutdown();
            });
            // 🔐 Handle Unhandled Promise Rejections
            process.on('unhandledRejection', (reason) => {
                console.error('❌ Unhandled Rejection:', reason);
                shutdown();
            });
            // 🛑 Graceful Shutdown
            process.on('SIGTERM', () => {
                console.info('🔁 SIGTERM received.');
                shutdown();
            });
        }
        catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    });
}
// 🔁 Graceful Server Shutdown
function shutdown() {
    if (server) {
        server.close(() => {
            console.info('🔒 Server closed gracefully.');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
}
main();
