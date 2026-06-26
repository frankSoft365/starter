import type { TopicNameRequest, TopicSuggestionVO } from '../types/topic';
import request from "../utils/request";

export async function getTopicSuggestion(params: TopicNameRequest) {
    return request.post<TopicNameRequest, TopicSuggestionVO[]>('/topic/getSuggestion', params);
}
