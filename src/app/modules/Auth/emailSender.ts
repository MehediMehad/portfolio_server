import nodemailer from 'nodemailer';
import config from '../../../config';

const emailSender = async (email: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: config.node_mailer.email,
            pass: config.node_mailer.app_password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"Health Care" <mdmehedihasanmehad@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Reset Password Link', // Subject line
        // text: 'Hello world?', // plain text body
        html: html // html body
    });

    console.log('Message sent: %s', info.messageId);
};

export default emailSender;
