import prisma from '../../../shared/prisma';
import { Request } from 'express';
import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';

const sendReview = async (req: Request) => {
    const { userId } = req.user || {};
    const { eventId, rating, comment } = req.body;

    if (!userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    if (!eventId || !rating) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Event ID and rating are required'
        );
    }

    // Check if event exists
    const eventExists = await prisma.events.findUnique({
        where: { id: eventId }
    });

    if (!eventExists) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }

    // Check if user has already reviewed this event
    const existingReview = await prisma.review.findUnique({
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        }
    });

    if (existingReview) {
        throw new ApiError(
            httpStatus.CONFLICT,
            'You have already reviewed this event'
        );
    }

    // Create the review
    const review = await prisma.review.create({
        data: {
            userId,
            eventId,
            rating,
            comment
        },
        include: {
            user: true,
            event: true
        }
    });

    return review;
};

// Get all reviews of an event + average rating
const getReview = async (eventId: string) => {
    // Get all reviews for this event
    const reviews = await prisma.review.findMany({
        where: {
            eventId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profilePhoto: true
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    });

    if (!reviews.length) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'No reviews found for this event'
        );
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => {
        const ratingValue = Number(review.rating);
        return sum + ratingValue;
    }, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

    // Return enriched data
    return {
        reviews,
        averageRating,
        totalReviews: reviews.length
    };
};

const getMyReview = async (userId: string) => {
    const reviews = await prisma.review.findMany({
        where: {
            userId
        },
        include: {
            event: {
                select: {
                    title: true,
                    location: true,
                    date_time: true,
                    coverPhoto: true,
                    is_paid: true,
                    is_public: true,
                    description: true
                }
            },
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    });

    return reviews;
};

const deleteReview = async (userId: string, reviewId: string) => {
    // Check if the review exists and belongs to the user
    const review = await prisma.review.findFirst({
        where: {
            id: reviewId,
            userId
        }
    });

    if (!review) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'Review not found or you are not authorized to delete this review'
        );
    }

    // Delete the review
    await prisma.review.delete({
        where: {
            id: reviewId
        }
    });

    return {
        message: 'Review deleted successfully'
    };
};

export interface UpdateReviewData {
    rating?: string;
    comment?: string;
}
const updateReview = async (
    reviewId: string,
    userId: string,
    data: UpdateReviewData
) => {
    // Check if review exists and belongs to user
    const existingReview = await prisma.review.findFirst({
        where: {
            id: reviewId,
            userId
        }
    });

    if (!existingReview) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'Review not found or unauthorized'
        );
    }

    // Update review
    const updatedReview = await prisma.review.update({
        where: {
            id: reviewId
        },
        include: {
            event: true,
            user: true
        },
        data
    });

    return updatedReview;
};

export const ReviewsService = {
    sendReview,
    getReview,
    getMyReview,
    deleteReview,
    updateReview
};
