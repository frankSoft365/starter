import { XIcon } from "@phosphor-icons/react";

export default function Topic({ topicContent, handleDelete }: { topicContent: string, handleDelete: () => void }) {

    return (
        <div className="badge badge-lg rounded-full border-gray-200 bg-gray-50 gap-0.5 flex-none inline-flex items-center">
            <p className="text-xs mr-1">{topicContent}</p>
            <button onClick={handleDelete} className="btn btn-ghost btn-xs btn-square p-0 focus:outline-none focus:ring-0">
                <XIcon size={16} />
            </button>
        </div>
    );
}