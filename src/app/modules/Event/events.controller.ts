import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { EventService } from './events.service';
import pick from '../../../shared/pick';
import { eventFilterableFields } from './event.constants';
import { ToggleHeroSectionInput } from './events.interface';

const createEvent = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.createEvent(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Event created successfully!',
        data: result
    });
});

const getAllUpcomingEvent = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.getAllUpcomingEvent();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Event created successfully!',
        data: result
    });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await EventService.getByIdFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Event retrieval successfully',
        data: result
    });
});

const getMyEventsFromDB = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const result = await EventService.getMyEventsFromDB(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My Event retrieval successfully',
        data: result
    });
});

// Event Details Page
const getAllEventsDetailsPage = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, eventFilterableFields);
        const options = pick(req.query, [
            'limit',
            'page',
            'sortBy',
            'sortOrder'
        ]);
        const result = await EventService.getAllEventsDetailsPage(
            filters,
            options
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Events retrieval successfully',
            data: result
        });
    }
);

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await EventService.updateIntoDB(req, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Event data updated!',
        data: result
    });
});

const addHeroSection = catchAsync(async (req: Request, res: Response) => {
    const { eventId } = req.body;
    const result = await EventService.addHeroSection(eventId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Event data updated!',
        data: result
    });
});

const joinEvent = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.joinEvent(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Join Event successfully!',
        data: result
    });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const eventId = req.params.id;
    const userId = req.user.userId;
    const result = await EventService.deleteEvent(eventId, userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Event deleted successfully!',
        data: result
    });
});

export const EventsController = {
    createEvent,
    getAllUpcomingEvent,
    getByIdFromDB,
    updateIntoDB,
    addHeroSection,
    getMyEventsFromDB,
    getAllEventsDetailsPage,
    joinEvent,
    deleteEvent
};
