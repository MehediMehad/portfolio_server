import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const {userId}= req.body
    const result = await PaymentService.initPayment(eventId, userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment initiate successfully',
        data: result,
    });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
    
    const result = await PaymentService.validatePayment(req.query);
    
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment validate successfully',
        data: result,
    });
});

export const PaymentController = {
    initPayment,
    validatePayment
}