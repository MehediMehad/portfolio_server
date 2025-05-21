

export const isDateInFuture = (dateTime: string, now: Date): boolean =>
    new Date(dateTime.replace(' ', 'T')) >= now;
