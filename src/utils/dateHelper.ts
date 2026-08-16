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

export function formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}