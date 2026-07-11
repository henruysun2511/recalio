export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
}

export enum Algorithm {
    SM2 = "SM2",
    FSRS = "FSRS",
}

export enum LeechAction {
    SUSPEND = "SUSPEND",
    FLAG = "FLAG",
}

export enum NoteTemplateType {
    BASIC = "BASIC",
    BASIC_REVERSED = "BASIC_REVERSED",
    CLOZE = "CLOZE",
}

export enum PartOfSpeech {
    NOUN = "NOUN",
    VERB = "VERB",
    ADJECTIVE = "ADJECTIVE",
    ADVERB = "ADVERB",
    PREPOSITION = "PREPOSITION",
    CONJUNCTION = "CONJUNCTION",
    PRONOUN = "PRONOUN",
    DETERMINER = "DETERMINER",
    INTERJECTION = "INTERJECTION",
    PHRASE = "PHRASE",
    OTHER = "OTHER",
}

export const PARTS_OF_SPEECH = Object.values(PartOfSpeech);

export enum CardState {
    NEW = "NEW",
    LEARNING = "LEARNING",
    RELEARNING = "RELEARNING",
    REVIEW = "REVIEW",
    SUSPENDED = "SUSPENDED",
}

export enum ReviewRating {
    AGAIN = "AGAIN",
    HARD = "HARD",
    GOOD = "GOOD",
    EASY = "EASY",
}

export enum NotificationType {
    STUDY_REMINDER = "STUDY_REMINDER",
    CARDS_DUE = "CARDS_DUE",
    ACHIEVEMENT_EARNED = "ACHIEVEMENT_EARNED",
    DECK_REPORTED = "DECK_REPORTED",
    DECK_BANNED = "DECK_BANNED",
    SYSTEM = "SYSTEM",
}

export enum NotificationChannel {
    EMAIL = "EMAIL",
    WEB_PUSH = "WEB_PUSH",
    MOBILE_PUSH = "MOBILE_PUSH",
}

export enum ReportReason {
    COPYRIGHT = "COPYRIGHT",
    SPAM = "SPAM",
    INAPPROPRIATE = "INAPPROPRIATE",
    OTHER = "OTHER",
}

export enum ReportStatus {
    PENDING = "PENDING",
    REVIEWED = "REVIEWED",
    DISMISSED = "DISMISSED",
    ACTION_TAKEN = "ACTION_TAKEN",
}
