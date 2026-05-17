import { useAtomValue } from "jotai";
import { isLoginAtom } from "../stores/user";

/**
 * children in component shows only when isLogin
 */
export default function SignedIn({ children }: { children: React.ReactNode }) {
    const isLogin = useAtomValue(isLoginAtom);
    return (
        <>
            {isLogin ? children : <></>}
        </>
    );
}