import { useState } from "react";
import { createPortal } from 'react-dom'

function hideOpenPopovers() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll<HTMLElement>('[popover]').forEach((popover) => {
        const hideFn = (popover as any).hidePopover;
        if (typeof hideFn === 'function') {
            hideFn.call(popover);
        }
        if (popover.hasAttribute('open')) {
            popover.removeAttribute('open');
        }
    });
}

export default function Modal({
    children,
    buttonName,
    onDone,
    onCancel,
    disabled = false
}: {
    children: React.ReactNode
    buttonName: string,
    onDone?: () => void,
    onCancel: () => void,
    disabled?: boolean
}) {
    const [isOpen, setIsOpen] = useState(false);
    const close = () => setIsOpen(false);

    return (
        <>
            <button
                className="btn btn-sm btn-ghost justify-start text-left"
                onClick={() => {
                    hideOpenPopovers();
                    setIsOpen(true);
                }}>{buttonName}</button>
            {isOpen && (typeof document !== 'undefined' ? createPortal(
                <>
                    <div className="fixed inset-0 bg-black/40 z-9998" onClick={close} />
                    <dialog open className="modal z-9999" role="dialog" aria-modal="true">
                        <div className="modal-box w-11/12">
                            {children}
                            <div className="modal-action justify-center items-center gap-2">
                                <button type="button" onClick={() => {
                                    onCancel();
                                    close();
                                }} className="btn">Cancel</button>
                                <button disabled={disabled} type="button" className="btn btn-neutral" onClick={() => {
                                    onDone && onDone();
                                    close();
                                }}>Done</button>
                            </div>
                        </div>
                    </dialog>
                </>, document.body) : null)}
        </>
    );
}