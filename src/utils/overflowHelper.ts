export default function useOverflowHelper() {
    const handleOverflow = (text: string | undefined, length: number) => {
        if (!text) {
            return '';
        }
        if (text.length > length) {
            return `${text.substring(0, length - 1)}...`
        }
        return text;
    }
    return {
        handleOverflow
    };
}