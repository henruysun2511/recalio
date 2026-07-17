"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Loader2, CheckCircle2, EyeOff, Ban, Check, X as XIcon } from "lucide-react"
import { useDueCards, useCardsByDeck } from "@/queries/useCardQuery"
import { useCreateSession, useEndSession } from "@/queries/useStudySessionQuery"
import { useReviewCard, useSuspendCard, useBuryCard } from "@/queries/useCardQuery"
import { useDeck } from "@/queries/useDeckQuery"
import { ReviewRating } from "@/constants/type"
import { handleError } from "@/utils/handleError"
import { STATE_BADGE } from "@/utils/mapping"
import { CardPreview, buildFieldMap, processBackHtml, hasTypeMarker } from "@/components/common/card-preview"
import { ImageOcclusionCardView } from "@/app/(user)/deck/[id]/create-notes/image-occlusion-card-view"
import type { ReviewCardInput } from "@/schemas/card.schema"

type Phase = "loading" | "studying" | "done"

const ratingConfig = [
    { rating: ReviewRating.AGAIN, label: "Again", sub: "Quên — làm lại", color: "bg-red-500 hover:bg-red-600" },
    { rating: ReviewRating.HARD, label: "Hard", sub: "Nhớ nhưng khó", color: "bg-orange-500 hover:bg-orange-600" },
    { rating: ReviewRating.GOOD, label: "Good", sub: "Nhớ — bình thường", color: "bg-green-500 hover:bg-green-600" },
    { rating: ReviewRating.EASY, label: "Easy", sub: "Rất dễ — bỏ qua", color: "bg-blue-500 hover:bg-blue-600" },
]

export default function StudySessionPage() {
    const { deckId } = useParams<{ deckId: string }>()
    const searchParams = useSearchParams()
    const router = useRouter()
    const urlSessionId = searchParams.get('sessionId')
    const urlMode = (searchParams.get('mode') as 'cram' | 'preview' | null) ?? undefined
    const isCustomSession = urlMode === 'cram' || urlMode === 'preview'

    const { data: deckRes } = useDeck(deckId)
    const { data: cardsRes, isLoading: cardsLoading } = useDueCards({ deckId, page: 1, limit: 200, mode: urlMode ?? 'normal' })
    const createSession = useCreateSession()
    const endSession = useEndSession()
    const reviewCard = useReviewCard()
    const suspendCard = useSuspendCard()
    const buryCard = useBuryCard()
    const deck = (deckRes as any)?.data

    const [allCards, setAllCards] = useState<any[]>([])
    const [sessionId, setSessionId] = useState<string | null>(urlSessionId)
    const { data: allDeckCardsData } = useCardsByDeck(deckId, { page: 1, limit: 50 })
    const deckCards = (allDeckCardsData as any)?.data ?? []
    const [phase, setPhase] = useState<Phase>("loading")
    const [currentIndex, setCurrentIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const [stats, setStats] = useState({ reviewed: 0, again: 0, hard: 0, good: 0, easy: 0 })
    const [submitting, setSubmitting] = useState(false)
    const [typedAnswer, setTypedAnswer] = useState("")
    const [answerResult, setAnswerResult] = useState<{ correct: boolean; expected: string } | null>(null)
    const initializedRef = useRef(false)
    const sessionStartedRef = useRef(false)
    const sessionIdRef = useRef<string | null>(null)
    const startTimeRef = useRef(0)
    const inputRef = useRef<HTMLInputElement>(null)

    const currentCard = allCards[currentIndex]
    const isLastCard = currentIndex >= allCards.length - 1

    const fieldMap = useMemo(() => buildFieldMap(currentCard), [currentCard])
    const isTypeAnswer = useMemo(() => hasTypeMarker(currentCard?.backHtml ?? ""), [currentCard])
    const processedBackHtml = useMemo(() => processBackHtml(currentCard?.backHtml ?? "", fieldMap), [currentCard, fieldMap])

    const startSession = useCallback(async () => {
        if (sessionStartedRef.current) return
        sessionStartedRef.current = true
        if (urlSessionId) {
            sessionIdRef.current = urlSessionId
            setSessionId(urlSessionId)
            return
        }
        try {
            const res = await createSession.mutateAsync({ deckId })
            const session = (res as any)?.data
            if (session?.id) {
                setSessionId(session.id)
                sessionIdRef.current = session.id
            }
        } catch (err) {
            handleError(err, "Không thể bắt đầu phiên học")
            router.push("/study")
        }
    }, [deckId, createSession, urlSessionId])

    useEffect(() => {
        if (initializedRef.current) return
        if (cardsLoading || cardsRes === undefined) return
        const dueCards = ((cardsRes as any)?.data || []) as any[]
        initializedRef.current = true
        if (dueCards.length === 0) {
            setPhase("done")
        } else {
            setAllCards(dueCards)
            startTimeRef.current = performance.now()
            startSession().then(() => setPhase("studying"))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardsLoading, cardsRes])

    const handleFlip = () => {
        setFlipped((v) => !v)
        setTypedAnswer("")
        setAnswerResult(null)
        setTimeout(() => inputRef.current?.focus(), 100)
    }

    const handleRating = async (rating: ReviewRating) => {
        if (submitting || !currentCard || !flipped) return
        setSubmitting(true)

        if (isTypeAnswer && !answerResult) {
            const typeFieldName = "Text"
            const expected = fieldMap[typeFieldName] || ""
            const correct = typedAnswer.trim().toLowerCase() === expected.trim().toLowerCase()
            setAnswerResult({ correct, expected })
            setSubmitting(false)
            return
        }

        const responseTimeMs = Math.round(performance.now() - startTimeRef.current)
        const data: ReviewCardInput = { rating, responseTimeMs }
        if (sessionIdRef.current) data.sessionId = sessionIdRef.current

        try {
            await reviewCard.mutateAsync({ id: currentCard.id, data })
            setStats((prev) => ({
                ...prev,
                reviewed: prev.reviewed + 1,
                [rating.toLowerCase() as keyof typeof prev]: prev[rating.toLowerCase() as keyof typeof prev] + 1,
            }))

            if (isLastCard) {
                if (sessionIdRef.current) {
                    await endSession.mutateAsync(sessionIdRef.current)
                }
                setPhase("done")
            } else {
                setCurrentIndex((i) => i + 1)
                setFlipped(false)
                setTypedAnswer("")
                setAnswerResult(null)
                startTimeRef.current = performance.now()
            }
        } catch (err) {
            handleError(err, "Ghi nhận kết quả thất bại")
        } finally {
            setSubmitting(false)
        }
    }

    const handleSkip = async (action: "bury" | "suspend") => {
        if (!currentCard || submitting) return
        setSubmitting(true)
        try {
            if (action === "bury") {
                await buryCard.mutateAsync(currentCard.id)
            } else {
                await suspendCard.mutateAsync(currentCard.id)
            }
            if (isLastCard) {
                if (sessionIdRef.current) {
                    await endSession.mutateAsync(sessionIdRef.current)
                }
                setPhase("done")
            } else {
                setCurrentIndex((i) => i + 1)
                setFlipped(false)
                setTypedAnswer("")
                setAnswerResult(null)
                startTimeRef.current = performance.now()
            }
        } catch (err) {
            handleError(err, "Thao tác thất bại")
        } finally {
            setSubmitting(false)
        }
    }

    if (phase === "loading") {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-terracotta" />
            </div>
        )
    }

    if (phase === "done") {
        const total = stats.reviewed
        const accuracy = total > 0 ? Math.round(((stats.good + stats.easy) / total) * 100) : 0
        return (
            <div className="space-y-6">
                <button onClick={() => router.push("/study")} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary">
                    <ArrowLeft className="size-4" /> Quay lại
                </button>
                <div className="flex flex-col items-center justify-center rounded-3xl border border-beige bg-white py-16 px-6 text-center shadow-sm">
                    <CheckCircle2 className="size-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-black text-text-primary">Hoàn thành!</h2>
                    <p className="mt-1 text-text-muted">Bạn đã ôn tập xong bộ thẻ này</p>

                    <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
                        <div className="rounded-2xl border border-beige bg-cream p-4">
                            <p className="text-xs font-medium text-text-muted">Đã ôn</p>
                            <p className="text-2xl font-black text-text-primary">{total}</p>
                        </div>
                        <div className="rounded-2xl border border-beige bg-cream p-4">
                            <p className="text-xs font-medium text-text-muted">Chính xác</p>
                            <p className="text-2xl font-black text-green-600">{accuracy}%</p>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => router.push(sessionIdRef.current ? `/study/session/${sessionIdRef.current}` : "/study")}
                            className="rounded-xl bg-terracotta px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-dark"
                        >
                            Xem chi tiết
                        </button>
                        <button
                            onClick={() => router.push("/study")}
                            className="rounded-xl border border-beige bg-white px-6 py-3 text-sm font-semibold text-text-primary hover:bg-cream"
                        >
                            Danh sách
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <style>{`
                .cloze {
                    font-weight: 800;
                    color: #92400e;
                    background: rgba(251,191,36,0.15);
                    padding: 2px 8px;
                    border-radius: 6px;
                    border: 1.5px solid rgba(251,191,36,0.3);
                    font-size: 0.9em;
                }
                .cloze-reveal {
                    font-weight: 800;
                    color: #166534;
                    background: rgba(34,197,94,0.12);
                    padding: 2px 8px;
                    border-radius: 6px;
                    border: 1.5px solid rgba(34,197,94,0.3);
                    font-size: 0.9em;
                }
                .card-audio-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    border-radius: 10px;
                    background: rgba(201, 106, 66, 0.1);
                    color: var(--terracotta-dark);
                    font-weight: 700;
                    font-size: 13px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.15s;
                }
                .card-audio-btn:hover {
                    background: var(--terracotta-dark);
                    color: white;
                }
                .card-image {
                    max-height: 180px;
                    border-radius: 12px;
                    object-fit: cover;
                    margin: 8px auto;
                    display: block;
                }
            `}</style>
            <div className="flex items-center justify-between">
                <button onClick={() => router.push("/study")} className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary">
                    <ArrowLeft className="size-4" /> {deck?.name || "Học tập"}
                </button>
                <div className="flex items-center gap-2">
                    {urlMode === 'cram' && (
                        <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-700">Cram</span>
                    )}
                    {urlMode === 'preview' && (
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">Preview</span>
                    )}
                    <span className="text-sm font-medium text-text-muted">
                        {currentIndex + 1} / {allCards.length}
                    </span>
                </div>
            </div>

            <div className="h-1.5 w-full rounded-full bg-beige overflow-hidden">
                <div
                    className="h-full rounded-full bg-terracotta transition-all duration-300"
                    style={{ width: `${(currentIndex / allCards.length) * 100}%` }}
                />
            </div>

            <div
                onClick={handleFlip}
                className="relative min-h-[60vh] w-full cursor-pointer rounded-3xl border border-beige bg-white shadow-sm transition-all hover:shadow-md overflow-hidden [perspective:1000px]"
            >
                <div className={`relative w-full min-h-[55vh] transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 [backface-visibility:hidden]">
                        {currentCard?.occlusion ? (
                            <ImageOcclusionCardView
                                imageUrl={currentCard.occlusion.imageUrl}
                                masks={currentCard.occlusion.masks}
                                variantIndex={currentCard.variantIndex}
                                showBack={false}
                            />
                        ) : (
                            <div
                                className="w-full text-center [&_img]:max-h-48 [&_img]:rounded-xl [&_img]:object-cover"
                                dangerouslySetInnerHTML={{ __html: currentCard?.frontHtml || "" }}
                            />
                        )}
                        <style>{currentCard?.css}</style>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        {currentCard?.occlusion ? (
                            <ImageOcclusionCardView
                                imageUrl={currentCard.occlusion.imageUrl}
                                masks={currentCard.occlusion.masks}
                                variantIndex={currentCard.variantIndex}
                                showBack={true}
                            />
                        ) : (
                            <div
                                className="w-full text-center [&_img]:max-h-48 [&_img]:rounded-xl [&_img]:object-cover"
                                dangerouslySetInnerHTML={{ __html: processedBackHtml }}
                            />
                        )}
                        <style>{currentCard?.css}</style>
                        {isTypeAnswer && answerResult && (
                            <div className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${answerResult.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {answerResult.correct ? (
                                    <><Check className="size-4" /> Chính xác!</>
                                ) : (
                                    <><XIcon className="size-4" /> Đáp án: <span className="font-black">{answerResult.expected}</span></>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {flipped && (
                <div className="space-y-2">
                    {isTypeAnswer && !answerResult && (
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                value={typedAnswer}
                                onChange={(e) => setTypedAnswer(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleRating(ReviewRating.GOOD) }}
                                placeholder="Gõ đáp án của bạn..."
                                className="h-12 flex-1 rounded-xl border-2 border-beige bg-white px-4 text-sm font-medium text-text-primary focus:border-terracotta focus:outline-none"
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => handleSkip("bury")}
                            disabled={submitting}
                            className="group relative flex items-center gap-1.5 rounded-lg border border-beige bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-all hover:bg-cream hover:text-text-primary disabled:opacity-50"
                            title="Ẩn thẻ đến hết ngày"
                        >
                            <EyeOff className="size-3.5" />
                            Ẩn
                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                                hết ngày
                            </span>
                        </button>
                        <button
                            onClick={() => handleSkip("suspend")}
                            disabled={submitting}
                            className="group relative flex items-center gap-1.5 rounded-lg border border-beige bg-white px-3 py-1.5 text-xs font-medium text-text-muted transition-all hover:bg-cream hover:text-text-primary disabled:opacity-50"
                            title="Tạm dừng thẻ vĩnh viễn"
                        >
                            <Ban className="size-3.5" />
                            Tạm dừng
                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                                vĩnh viễn
                            </span>
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {ratingConfig.map((cfg) => (
                            <button
                                key={cfg.rating}
                                onClick={() => handleRating(cfg.rating)}
                                disabled={submitting}
                                className={`rounded-xl py-2.5 text-sm font-bold text-white transition disabled:opacity-50 ${cfg.color}`}
                            >
                                {submitting ? (
                                    <Loader2 className="mx-auto size-5 animate-spin" />
                                ) : (
                                    <span className="block">{cfg.label}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!flipped && (
                <p className="text-center text-xs text-text-muted">
                    Nhấn Space hoặc chạm để lật thẻ
                </p>
            )}
            {flipped && !answerResult && (
                <p className="text-center text-xs text-text-muted">
                    {isTypeAnswer ? "Gõ đáp án, Enter để kiểm tra" : "Phím 1-4 để đánh giá"}
                </p>
            )}
            {flipped && answerResult && (
                <p className="text-center text-xs text-text-muted">
                    Phím 1-4 để đánh giá
                </p>
            )}

            {/* Rating legend */}
            <div className="flex items-center justify-center gap-4 text-xs font-medium text-text-muted pt-4 border-t border-beige">
                <span className="flex items-center gap-1"><span className="size-2.5 rounded bg-red-500" /> Again: Quên</span>
                <span className="flex items-center gap-1"><span className="size-2.5 rounded bg-orange-500" /> Hard: Khó</span>
                <span className="flex items-center gap-1"><span className="size-2.5 rounded bg-green-500" /> Good: Bình thường</span>
                <span className="flex items-center gap-1"><span className="size-2.5 rounded bg-blue-500" /> Easy: Rất dễ</span>
            </div>

            {/* All deck cards */}
            <div className="pt-4 border-t border-beige">
                <h3 className="text-sm font-bold text-text-primary tracking-tight mb-3">
                    Tất cả thẻ trong deck ({deckCards.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {deckCards.map((card: any) => {
                        const badge = STATE_BADGE[card.state] ?? { label: card.state, className: "bg-gray-100 text-gray-500" }
                        return (
                            <div key={card.id} className="relative">
                                <CardPreview card={card} compact />
                                <span className={`absolute top-1.5 right-1.5 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badge.className}`}>
                                    {badge.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

