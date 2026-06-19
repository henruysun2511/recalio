import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { CreateReviewInput, Review, ReviewParams } from "@/schemas/review.schema";
import { Pagination } from "@/constants/pagination";

const reviewService = {
    createOrUpdate: (deckId: string, data: CreateReviewInput) => {
        return http.post<ApiResponse<Review>>(`/reviews/decks/${deckId}`, data);
    },

    listByDeck: (deckId: string, params?: ReviewParams) => {
        return http.get<ApiResponse<Review[]> & { meta?: Pagination }>(`/reviews/decks/${deckId}`, { params });
    },

    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`/reviews/${id}`);
    },
};

export default reviewService;
