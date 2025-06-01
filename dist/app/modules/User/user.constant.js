"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ROLE = exports.userFilterableFields = exports.userSearchAbleFields = void 0;
const client_1 = require("@prisma/client");
exports.userSearchAbleFields = ['email']; // only for search term
exports.userFilterableFields = [
    'email',
    'role',
    'status',
    'searchTerm'
]; // for all filtering
exports.USER_ROLE = {
    ADMIN: client_1.UserRole.ADMIN,
    USER: client_1.UserRole.USER
};
