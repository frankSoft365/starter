import { useState, type KeyboardEvent } from "react";
import Topic from "../../ui/Topic";
import { debounce } from "es-toolkit/function";
import { getTopicSuggestion } from "../../services/apiTopic";
import type { TopicSuggestionVO } from "../../types/topic";
import * as z from "zod";

export const TopicCandidateSchema = z.string()
    .trim()
    .regex(/^[\p{L}0-9\s-]*$/u, "Tags only support letters, numbers, spaces and dashes.")
    .max(25, "A tag name must be 25 characters max.");

function formatArticlesCount(count: string) {
    const num = Number(count);
    if (Number.isNaN(num)) return count;
    if (num >= 1_000_000) return `${Math.round(num / 1_000_000)}M`;
    if (num >= 1_000) return `${Math.round(num / 1_000)}K`;
    return `${num}`;
}

function getSuggestionLabel(suggestion: TopicSuggestionVO) {
    if (suggestion.status === 'new') {
        return `${suggestion.name} (new)`;
    }
    const count = formatArticlesCount(suggestion.articlesCount);
    return count ? `${suggestion.name} (${count})` : suggestion.name;
}

export default function TopicInput({ topicsField, candidateField, max = 5 }: { topicsField: any; candidateField: any; max?: number }) {
    const [suggestions, setSuggestions] = useState<TopicSuggestionVO[]>([]);
    const [isDropdownShow, setIsDropdownShow] = useState(false);
    const topic = String(candidateField.state.value ?? '');

    const handleInputChange = debounce(async (topicName: string) => {
        const suggestionList = await getTopicSuggestion({ name: topicName });
        setSuggestions(suggestionList);
        setIsDropdownShow(true);
    }, 300);

    return (
        <div className="relative w-full">
            <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-3 min-h-12 w-full border-gray-200 border rounded-sm">
                {topicsField.state.value.map((value: string, index: number) => (
                    <Topic key={index} topicContent={value} handleDelete={() => topicsField.removeValue(index)} />
                ))}

                {topicsField.state.value.length < max && (
                    <input
                        value={topic}
                        type="text"
                        placeholder={topicsField.state.value.length === 0 ? 'Add a topic...' : 'Add more topics...'}
                        className="text-sm bg-transparent border-none focus:outline-none focus:shadow-none hover:border-none active:border-none flex-1 min-w-32 max-w-full h-7 p-0"
                        onBlur={() => {
                            handleInputChange.cancel();
                            candidateField.handleChange('');
                            setIsDropdownShow(false);
                        }}
                        onChange={(e) => {
                            const topicName = e.target.value;
                            candidateField.handleChange(topicName);
                            const validation = TopicCandidateSchema.safeParse(topicName);
                            if (validation.success && topicName.trim().length > 0) {
                                handleInputChange(topicName);
                            } else {
                                handleInputChange.cancel();
                                setIsDropdownShow(false);
                            }
                        }}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                            if (e.key !== 'Enter') return;

                            e.preventDefault();

                            if (isDropdownShow && suggestions.length > 0) {
                                const nextTopic = suggestions[0].name;
                                if (!topicsField.state.value.includes(nextTopic)) {
                                    topicsField.pushValue(nextTopic);
                                }
                                candidateField.handleChange('');
                                setIsDropdownShow(false);
                            }

                        }}
                    />
                )}
            </div>

            {candidateField.state.meta.isTouched && candidateField.state.meta.errors[0]?.message && (
                <div className="mt-1 text-xs text-red-500">{candidateField.state.meta.errors[0]?.message}</div>
            )}
            {isDropdownShow && suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.name}
                            type="button"
                            onMouseDown={(event) => {
                                event.preventDefault();
                                if (!topicsField.state.value.includes(suggestion.name)) {
                                    topicsField.pushValue(suggestion.name);
                                }
                                candidateField.handleChange('');
                                setIsDropdownShow(false);
                            }}
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <span>{getSuggestionLabel(suggestion)}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
