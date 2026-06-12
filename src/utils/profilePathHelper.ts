export default function useProfilePathHelper() {
    const handleProfilePath = (email: string | undefined) => {
        if (!email) {
            return 'unknown';
        }
        return `${email.split('@')[0]}`;
    }
    return {
        handleProfilePath
    };
}