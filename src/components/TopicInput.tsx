import { useState, type KeyboardEvent } from "react";
import Topic from "./Topic";

export default function TopicInput({ field, max = 5 }: { field: any; max?: number }) {
    const [topic, setTopic] = useState('');

    return (
        <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-3 min-h-12 w-full border-gray-200 border rounded-sm">
            {field.state.value.map((value: string, index: number) => (
                <Topic key={index} topicContent={value} handleDelete={() => field.removeValue(index)} />
            ))}

            {field.state.value.length < max && (
                <input
                    value={topic}
                    type="text"
                    placeholder={field.state.value.length === 0 ? 'Add a topic...' : 'Add more topics...'}
                    className="text-sm bg-transparent border-none focus:outline-none focus:shadow-none hover:border-none active:border-none flex-1 w-auto min-w-12 max-w-full h-7 p-0"
                    onBlur={field.handleBlur}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault()
                            const trimmed = topic.trim()
                            if (trimmed) {
                                field.pushValue(trimmed)
                                setTopic('')
                            }
                        }
                    }}
                />
            )}
        </div>
    )
}
