import { isLoadingAtom } from "../atoms/user";
import Loading from "../ui/Loading";
import NeedLogin from "./NeedLogin";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";
import { useAtomValue } from 'jotai';

export default function RequireLogin({ children }: { children: React.ReactNode }) {
    const isLoading = useAtomValue(isLoadingAtom);
    return (
        <>
            <SignedIn>
                {children}
            </SignedIn>
            {isLoading && <Loading />}
            {!isLoading && <SignedOut>
                <NeedLogin />
            </SignedOut>}
        </>
    );
}