import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";

const prefix = "/search";

export interface SearchDeckResult {
    id: string;
    name: string;
    fullPath: string;
    description: string | null;
    coverImage: string | null;
    tags: string[];
    downloadCount: number;
    isFeatured: boolean;
    createdAt: string;
    user: { id: string; username: string; displayName: string; avatarUrl: string | null };
    _count: { notes: number; cards: number };
}

export interface SearchPostResult {
    id: string;
    title: string;
    content: string | null;
    tags: string[];
    likeCount: number;
    createdAt: string;
    user: { id: string; username: string; displayName: string; avatarUrl: string | null };
}

export interface SearchUserResult {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
}

export interface SearchResponse {
    decks: { data: SearchDeckResult[]; total: number };
    posts: { data: SearchPostResult[]; total: number };
    users: { data: SearchUserResult[]; total: number };
}

export interface SearchParams {
    q: string;
    entity?: "all" | "decks" | "posts" | "users";
    page?: number;
    limit?: number;
}

const searchService = {
    search: (params: SearchParams) => {
        return http.get<ApiResponse<SearchResponse>>(prefix, { params });
    },
};

export default searchService;
