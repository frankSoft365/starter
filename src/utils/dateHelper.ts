export function getPublishDate(date: Date) {
    const month = date.toLocaleString('en', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
}