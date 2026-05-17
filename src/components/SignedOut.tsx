import { useAtomValue } from "jotai";
import { isLoginAtom } from "../stores/user";

/**
 * children in component shows only when NOT isLogin
 */
export default function SignedOut({ children }: { children: React.ReactNode }) {
    const isLogin = useAtomValue(isLoginAtom);
    return (
        <>
            {isLogin ? <></> : children}
        </>
    );
}