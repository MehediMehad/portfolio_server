"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateInFuture = void 0;
const isDateInFuture = (dateTime, now) => new Date(dateTime.replace(' ', 'T')) >= now;
exports.isDateInFuture = isDateInFuture;
