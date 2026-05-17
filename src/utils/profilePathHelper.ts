export default function useProfilePathHelper() {
    const handleProfilePath = (email: string | undefined) => {
        if (!email) {
            return '';
        }
        return `${email.split('@')[0]}`;
    }
    return {
        handleProfilePath
    };
}