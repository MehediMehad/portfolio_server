import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SkillsService } from './skills.service';

// Create Skill
const createSkill = catchAsync(async (req: Request, res: Response) => {
    const result = await SkillsService.createSkill(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Skill created successfully!',
        data: result
    });
});

// Get All My Skills
const getAllMySkills = catchAsync(async (req: Request, res: Response) => {
    const result = await SkillsService.getAllMySkills();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Skills fetched successfully!',
        data: result
    });
});

// Delete Skill
const deleteSkill = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { skillId } = req.params;

    const result = await SkillsService.deleteSkill(userId, skillId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null
    });
});

// Update Skill
const updateSkill = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const result = await SkillsService.updateSkill(userId, req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Skill updated successfully',
        data: result
    });
});

export const SkillsController = {
    createSkill,
    getAllMySkills,
    deleteSkill,
    updateSkill
};
