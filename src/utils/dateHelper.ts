export function getPublishDate(date: Date) {
    const month = date.toLocaleString('en', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
}

export function isNew(date: Date) {
    const now = Date.now();
    const diff = now - date.getTime();
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
    return diff >= 0 && diff <= twoDaysMs;
};