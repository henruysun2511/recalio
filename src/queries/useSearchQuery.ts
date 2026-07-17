import { useQuery } from "@tanstack/react-query";
import searchService, { type SearchParams } from "@/services/search.service";

export const SEARCH_QUERY_KEY = ["search"];

export const useSearch = (params: SearchParams, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: [...SEARCH_QUERY_KEY, params],
        queryFn: async () => {
            const res = await searchService.search(params);
            return res.data;
        },
        enabled: options?.enabled ?? (params.q.length > 0),
    });
};
