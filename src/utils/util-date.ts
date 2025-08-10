export const parseDate = (dateStr: string): Date => {
    if (dateStr.includes('/')) {
        // Handle DD/MM/YYYY
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day); // Months are 0-based
    } else if (dateStr.includes('-')) {
        // Handle YYYY-MM-DD
        return new Date(dateStr);
    }
    throw new Error('Invalid date format');
};
