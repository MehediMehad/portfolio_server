import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        expires_in: process.env.EXPIRES_IN, // "5m"
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN // "30d"
    },
    reset_password: {
        secret_token: process.env.RESET_PASSWORD_TOKEN,
        expires_in: process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN as string, // "5m"
        link: process.env.RESET_PASSWORD_LINK // "http://localhost:3000/reset-pass"
    },
    myInfo: {
        my_email: process.env.MY_EMAIL,
        my_password: process.env.MY_PASSWORD,
        my_number: process.env.MY_NUMBER
    },
    node_mailer: {
        email: process.env.NODE_MAILER_EMAIL,
        app_password: process.env.NODE_MAILER_APP_PASSWORD
    },
    // Cloudinary
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    },
    ssl: {
        storeId: process.env.STORE_ID,
        storePass: process.env.STORE_PASS,
        sslPaymentApi: process.env.SSL_PAYMENT_API,
        sslValidationApi: process.env.SSL_VALIDATION_API,
        successUrl: process.env.SUCCESS_URL,
        cancelUrl: process.env.CANCEL_URL,
        failUrl: process.env.FAIL_URL
    }
};
