import { useAtomValue } from "jotai";
import { userAtom } from "../stores/user";
import Avatar from "./Avatar";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
    const user = useAtomValue(userAtom);
    const [username, setUsername] = useState(user?.username || '');
    const [image, setImage] = useState(user?.image || undefined);

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['get-current-user'],
        queryFn: async () => {
            return '';
        }
    })

    const mutation = useMutation({
        mutationFn: async () => {
            return '';
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['get-current-user'] })
        },
    })

    return (
        <div className="p-3 relative w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Settings</h1>
            {/* user information show */}
            <ul className="list bg-base-100 rounded-box shadow-md w-full">
                <li className="list-row">
                    <div className="text-left">Email address</div>
                    <div className="text-right">
                        {user?.email}
                    </div>
                </li>
                <li className="list-row">
                    <div className="text-left">Username</div>
                    <div className="text-right">
                        {user?.username}
                    </div>
                </li>
                <li className="list-row">
                    <div className="text-left">Photo</div>
                    <div className="text-right">
                        <Avatar imageUrl={user?.image ?? undefined} />
                    </div>
                </li>

            </ul>
            {/* update button */}
            <button onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement).showModal()} className="btn btn-primary absolute right-4 mt-4">Update</button>
            {/* dialog modal */}
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Profile information</h3>
                    <fieldset className="fieldset bg-base-200 border-base-300 w-xs md:w-full p-4">
                        <label className="label">Photo</label>
                        <div className="flex flex-row gap-4">
                            <Avatar imageUrl={image} hover={true} />
                            <div className="flex flex-col gap-4">
                                <div>
                                    <button className="btn btn-ghost btn-xs btn-success mr-2">Update</button>
                                    <button onClick={() => setImage(undefined)} className="btn btn-ghost btn-xs btn-error">Remove</button>
                                </div>
                                <div className="text-xs">Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.</div>
                            </div>
                        </div>

                        <label className="label">Username</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="input" placeholder="Username" />
                    </fieldset>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button onClick={() => {
                                setUsername(user?.username || '');
                                setImage(user?.image || undefined);
                            }} className="btn">Close</button>
                        </form>
                        <button
                            disabled={(username.trim() === (user?.username || '')) &&
                                (image === (user?.image || undefined))}
                            className="btn btn-success"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}