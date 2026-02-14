import type { Server as HttpServer } from 'http';
import app from './app';
import config from './config';
import seedSuperAdmin from './db/seedSuperAdmin';


let server: HttpServer;

async function main() {
    try {
        // 🟢 Start the server
        const port = config.port! as string;
        server = app.listen(port, async () => {
            await seedSuperAdmin()
            console.log(`🚀 Server is running on port ${port}`);
        });

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
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// 🔁 Graceful Server Shutdown
function shutdown() {
    if (server) {
        server.close(() => {
            console.info('🔒 Server closed gracefully.');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
}

main();