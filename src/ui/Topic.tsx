import { PlusIcon, XIcon } from "@phosphor-icons/react";

export default function Topic({ topicContent, handleDelete }: { topicContent: string, handleDelete: () => void }) {

    return (
        <div className="badge badge-lg rounded-full border-gray-200 bg-base-200 gap-0.5 flex-none inline-flex items-center">
            <p className="text-xs mr-1">{topicContent}</p>
            <button onClick={handleDelete} className="btn btn-ghost btn-xs btn-square p-0 focus:outline-none focus:ring-0">
                <XIcon size={16} />
            </button>
        </div>
    );
}

export function TopicShow({ topicContent }: { topicContent: string }) {
    return (
        <div className="badge hover:bg-base-200 cursor-pointer rounded-full border border-base-300">
            {topicContent}
            <PlusIcon size={16} />
        </div>
    );
}