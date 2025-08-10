"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = void 0;
const parseDate = (dateStr) => {
    if (dateStr.includes('/')) {
        // Handle DD/MM/YYYY
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day); // Months are 0-based
    }
    else if (dateStr.includes('-')) {
        // Handle YYYY-MM-DD
        return new Date(dateStr);
    }
    throw new Error('Invalid date format');
};
exports.parseDate = parseDate;
