"use client"

import React from "react"
import { Settings } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useUpdateDeckSetting } from "@/queries/useDeckSettingQuery"
import { handleError } from "@/utils/handleError"
import { Algorithm, LeechAction } from "@/constants/type"
import type { DeckSetting } from "@/schemas/deck-setting.schema"

interface DeckSettingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    deckId: string
    setting: DeckSetting
}

export function DeckSettingDialog({ open, onOpenChange, deckId, setting }: DeckSettingDialogProps) {
    const [algorithm, setAlgorithm] = React.useState(setting.algorithm)
    const [newCardsPerDay, setNewCardsPerDay] = React.useState(String(setting.newCardsPerDay))
    const [reviewsPerDay, setReviewsPerDay] = React.useState(String(setting.reviewsPerDay))
    const [learningSteps, setLearningSteps] = React.useState(setting.learningSteps)
    const [graduatingInterval, setGraduatingInterval] = React.useState(String(setting.graduatingInterval))
    const [easyInterval, setEasyInterval] = React.useState(String(setting.easyInterval))
    const [hardInterval, setHardInterval] = React.useState(String(setting.hardInterval))
    const [maximumInterval, setMaximumInterval] = React.useState(String(setting.maximumInterval))
    const [minimumInterval, setMinimumInterval] = React.useState(String(setting.minimumInterval))
    const [intervalModifier, setIntervalModifier] = React.useState(String(setting.intervalModifier))
    const [easyBonus, setEasyBonus] = React.useState(String(setting.easyBonus))
    const [lapseSteps, setLapseSteps] = React.useState(setting.lapseSteps)
    const [leechThreshold, setLeechThreshold] = React.useState(String(setting.leechThreshold))
    const [leechAction, setLeechAction] = React.useState(setting.leechAction)
    const [requestRetention, setRequestRetention] = React.useState(String(setting.requestRetention))

    const updateMutation = useUpdateDeckSetting()

    const handleSave = async () => {
        try {
            await updateMutation.mutateAsync({
                deckId,
                data: {
                    algorithm,
                    newCardsPerDay: Number(newCardsPerDay),
                    reviewsPerDay: Number(reviewsPerDay),
                    learningSteps,
                    graduatingInterval: Number(graduatingInterval),
                    easyInterval: Number(easyInterval),
                    hardInterval: Number(hardInterval),
                    maximumInterval: Number(maximumInterval),
                    minimumInterval: Number(minimumInterval),
                    intervalModifier: Number(intervalModifier),
                    easyBonus: Number(easyBonus),
                    lapseSteps,
                    leechThreshold: Number(leechThreshold),
                    leechAction,
                    requestRetention: Number(requestRetention),
                },
            })
            toast.success("Cập nhật cài đặt thành công")
            onOpenChange(false)
        } catch (e) {
            handleError(e)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto admin-dialog-content">
                <DialogHeader className="admin-dialog-header">
                    <div className="admin-dialog-icon-box bg-peach">
                        <Settings className="size-5 text-terracotta" />
                    </div>
                    <DialogTitle className="admin-dialog-title">Cài đặt deck</DialogTitle>
                    <DialogDescription className="admin-dialog-description">
                        Điều chỉnh các thông số thuật toán SRS và lịch học
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 bg-muted/50 border-y text-sm text-muted-foreground space-y-2">
                    <p><strong>SRS (Spaced Repetition System)</strong> là thuật toán lên lịch ôn tập dựa trên phản hồi của bạn. Mỗi thẻ trải qua các trạng thái: <strong>Mới → Đang học → Ôn tập</strong> (hoặc <strong>Học lại</strong> nếu trả lời sai).</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Giới hạn hàng ngày</strong> — Kiểm soát số thẻ mới và thẻ ôn tập mỗi ngày để tránh quá tải.</li>
                        <li><strong>Bước học</strong> — Các mốc thời gian (phút) trước khi thẻ chuyển từ "Đang học" sang "Ôn tập".</li>
                        <li><strong>Khoảng cách</strong> — Thời gian giữa các lần ôn tập sau khi thẻ đã thuộc (ngày).</li>
                        <li><strong>Bộ điều chỉnh</strong> — Hệ số nhân ảnh hưởng đến tốc độ tăng khoảng cách và độ khó.</li>
                        <li><strong>Leech</strong> — Thẻ bị trả lời sai nhiều lần liên tiếp sẽ bị tạm ngưng hoặc đánh cờ.</li>
                    </ul>
                </div>

                <div className="admin-dialog-body space-y-6">
                    {/* Algorithm */}
                    <div className="space-y-2">
                        <Label>Thuật toán</Label>
                        <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as Algorithm)}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={Algorithm.SM2}>SM-2</SelectItem>
                                <SelectItem value={Algorithm.FSRS}>FSRS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Daily Limits */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Thẻ mới / ngày</Label>
                            <Input type="number" value={newCardsPerDay} onChange={(e) => setNewCardsPerDay(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Ôn tập / ngày</Label>
                            <Input type="number" value={reviewsPerDay} onChange={(e) => setReviewsPerDay(e.target.value)} />
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Bước học (cách nhau dấu cách)</Label>
                            <Input value={learningSteps} onChange={(e) => setLearningSteps(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Bước trượt (lapse)</Label>
                            <Input value={lapseSteps} onChange={(e) => setLapseSteps(e.target.value)} />
                        </div>
                    </div>

                    {/* Intervals */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Tốt nghiệp (ngày)</Label>
                            <Input type="number" value={graduatingInterval} onChange={(e) => setGraduatingInterval(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Dễ (ngày)</Label>
                            <Input type="number" value={easyInterval} onChange={(e) => setEasyInterval(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Khó (hệ số)</Label>
                            <Input type="number" step="0.1" value={hardInterval} onChange={(e) => setHardInterval(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Tối đa (ngày)</Label>
                            <Input type="number" value={maximumInterval} onChange={(e) => setMaximumInterval(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Tối thiểu (ngày)</Label>
                            <Input type="number" value={minimumInterval} onChange={(e) => setMinimumInterval(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Hệ số khoảng cách</Label>
                            <Input type="number" step="0.1" value={intervalModifier} onChange={(e) => setIntervalModifier(e.target.value)} />
                        </div>
                    </div>

                    {/* Modifiers */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Dễ bổ sung (easy bonus)</Label>
                            <Input type="number" step="0.1" value={easyBonus} onChange={(e) => setEasyBonus(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Ngưỡng ghi nhớ (request retention)</Label>
                            <Input type="number" step="0.01" value={requestRetention} onChange={(e) => setRequestRetention(e.target.value)} />
                        </div>
                    </div>

                    {/* Leech */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Ngưỡng leech (lần)</Label>
                            <Input type="number" value={leechThreshold} onChange={(e) => setLeechThreshold(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Hành động leech</Label>
                            <Select value={leechAction} onValueChange={(v) => setLeechAction(v as LeechAction)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={LeechAction.SUSPEND}>Tạm ngưng</SelectItem>
                                    <SelectItem value={LeechAction.FLAG}>Đánh cờ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter className="admin-dialog-footer">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Huỷ</Button>
                    <Button
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="bg-terracotta text-white hover:bg-terracotta-dark"
                    >
                        {updateMutation.isPending ? "Đang lưu..." : "Lưu cài đặt"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
