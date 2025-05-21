import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
    '/ipn',
    PaymentController.validatePayment
)

router.post(
    '/init-payment/:eventId',
    PaymentController.initPayment
)

export const PaymentRoutes = router;

