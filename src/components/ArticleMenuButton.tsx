export default function ArticleMenuButton({ children, disable }: { children: React.ReactNode, disable?: boolean }) {
    return (
        <button disabled={disable} className="btn btn-ghost btn-sm pl-0.5 gap-0.5 font-light">
            {children}
        </button>
    );
}