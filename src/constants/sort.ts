export enum SortOrder {
    DESC = "desc",
    ASC = "asc",
}

export const DeckSortBy = {
    NAME: "name",
    CREATED_AT: "createdAt",
    DOWNLOAD_COUNT: "downloadCount",
} as const;

export type DeckSortBy = (typeof DeckSortBy)[keyof typeof DeckSortBy];

export const CardSortBy = {
    DUE: "due",
    STATE: "state",
    CREATED_AT: "createdAt",
} as const;

export type CardSortBy = (typeof CardSortBy)[keyof typeof CardSortBy];

export const SessionSortBy = {
    STARTED_AT: "startedAt",
    ENDED_AT: "endedAt",
} as const;

export type SessionSortBy = (typeof SessionSortBy)[keyof typeof SessionSortBy];

export const NotificationSortBy = {
    SENT_AT: "sentAt",
    TYPE: "type",
} as const;

export type NotificationSortBy = (typeof NotificationSortBy)[keyof typeof NotificationSortBy];

export const ReviewSortBy = {
    CREATED_AT: "createdAt",
    RATING: "rating",
} as const;

export type ReviewSortBy = (typeof ReviewSortBy)[keyof typeof ReviewSortBy];
