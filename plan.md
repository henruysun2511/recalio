# Spec: Cloze & Image Occlusion chuẩn Anki — Recalio

> Đưa file này cho AI coding agent (Claude Code / Cursor...) làm theo thứ tự Phase 1 → 5.
> Repo: `recalio_backend` (NestJS + Prisma) và `recalio` (Next.js).
> Quy ước code bắt buộc tuân theo `CODEBASE.md` ở root `recalio_backend`.

---

## 0. Bối cảnh hiện tại (đã audit)

- `NoteTemplateType` enum hiện chỉ có `BASIC | BASIC_REVERSED | CLOZE`. Chưa có `IMAGE_OCCLUSION`.
- `Card` hiện được sinh **cố định 1:1** theo số `CardTemplate` của `NoteTemplate` (xem `note.repository.ts::createBatch`), **không phụ thuộc nội dung note**. Đây là giới hạn cốt lõi cần phá bỏ để làm Cloze/Occlusion chuẩn Anki (mỗi vùng ẩn = 1 Card riêng).
- `Note.fields: Json` đã là cột mở rộng sẵn có, được truyền xuyên suốt (`ConfirmWordDto.fields` → `note.repository.ts`). Dùng cột này để lưu `Text`/`Extra` của Cloze, không cần field cứng mới.
- Chưa xem được `card.service.ts` / `card.repository.ts` / trang **study/review** ở FE (nơi người dùng thực sự ôn tập, khác với `manual-tab.tsx` là nơi *tạo* note). **Đây là phần bắt buộc phải có để hoàn thành spec này** — xem mục "Cần bổ sung" cuối file.

### Nguyên tắc chuẩn Anki cần đạt
- **Cloze**: 1 note có N vùng ẩn khác nhau (`{{c1::...}}`, `{{c2::...}}`...) → sinh **N Card riêng biệt**. Mỗi Card chỉ che đúng 1 index của nó ở mặt Front; **các index khác trong cùng note hiển thị bình thường (không che)**; mặt Back lộ index đó ra (bôi đậm).
- **Image Occlusion**: 1 note có N vùng che trên ảnh (nhóm theo `groupIndex`) → sinh **N Card riêng biệt**, mỗi Card ẩn đúng 1 nhóm ở Front (mode "Hide All, Guess One" — các vùng khác vẫn che kín), Back lộ vùng đó.

---

## PHASE 1 — Database (`recalio_backend/prisma/schema.prisma`)

### 1.1 Enum
```prisma
enum NoteTemplateType {
  BASIC
  BASIC_REVERSED
  CLOZE
  IMAGE_OCCLUSION   // MỚI
}
```

### 1.2 `Card` — thêm field để biết Card này ứng với vùng ẩn nào
```prisma
model Card {
  // ...giữ nguyên toàn bộ field hiện có...
  variantIndex Int?   // MỚI. null = BASIC/BASIC_REVERSED. Số N = cloze index hoặc mask groupIndex.

  @@unique([noteId, cardTemplateId, variantIndex])  // MỚI — chống tạo trùng Card khi confirm lại
}
```
> Đặt tên chung `variantIndex` (không tách riêng `clozeIndex`/`occlusionGroup`) vì 1 Note chỉ thuộc 1 `NoteTemplateType`, không bao giờ vừa Cloze vừa Occlusion cùng lúc → không xung đột ý nghĩa.

### 1.3 Model mới `OcclusionMask`
```prisma
model OcclusionMask {
  id         String @id @default(uuid())
  noteId     String
  x          Float  // % theo chiều rộng ảnh, 0-100
  y          Float
  width      Float
  height     Float
  groupIndex Int    // các mask cùng groupIndex bị che chung ở 1 Card (giống {{c1::}} có thể lặp)
  label      String? // hiện ở Back, dùng như "Extra"

  note Note @relation(fields: [noteId], references: [id], onDelete: Cascade)

  @@index([noteId])
  @@map("occlusion_masks")
}
```

### 1.4 `Note` — thêm relation
```prisma
model Note {
  // ...giữ nguyên...
  occlusionMasks OcclusionMask[]   // MỚI
}
```

### 1.5 Migration
```bash
npx prisma migrate dev --name add_variant_index_and_occlusion
```

### 1.6 ⚠️ Seed data bắt buộc — chưa có `NoteTemplate` nào type `IMAGE_OCCLUSION`
Khác với Cloze (đã có sẵn 1 dòng `note_templates` type CLOZE + 1 dòng `card_templates`), **Image Occlusion chưa tồn tại bản ghi nào**. Nếu không tạo trước, `manual-tab.tsx` sẽ không có option này trong `<Select>`, và nếu cố tạo note với `templateId` không tồn tại → lỗi. Cần seed thủ công (SQL hoặc Prisma script) sau khi migrate:
```sql
INSERT INTO note_templates (id, name, type, "fieldNames")
VALUES (gen_random_uuid(), 'Image Occlusion', 'IMAGE_OCCLUSION', ARRAY['Image','Label']);

-- Lấy id vừa tạo, insert 1 card_template placeholder (không dùng frontHtml/backHtml thật vì FE tự render qua OcclusionCardView)
INSERT INTO card_templates (id, "noteTemplateId", name, "frontHtml", "backHtml", css)
VALUES (gen_random_uuid(), '<id note_template vừa tạo>', 'Image Occlusion', '', '', '');
```
`frontHtml`/`backHtml` để rỗng vì Phase 3.3 (`toOcclusionResponse`) không đọc 2 field này — chỉ cần `card_templates` row tồn tại để `cardTemplateMap[templateId]` không rỗng (nếu rỗng, `ctIds[0]` sẽ là `undefined` → insert Card thất bại do vi phạm FK `cardTemplateId`).

---

## PHASE 2 — Backend: Note module (tạo note)

### 2.1 `note.constant.ts`
Thêm regex + helper dùng chung:
```ts
export const CLOZE_MARKER_REGEX = /\{\{c(\d+)::(.*?)\}\}/g;
```

### 2.2 `note.dto.ts`
Thêm DTO cho mask, gắn vào `ConfirmWordDto`:
```ts
export class OcclusionMaskDto {
  @ApiProperty({ example: 12.5 })
  @Type(() => Number)
  @IsNumber({}, { message: 'x phải là số' })
  x: number;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsNumber({}, { message: 'y phải là số' })
  y: number;

  @ApiProperty({ example: 15 })
  @Type(() => Number)
  @IsNumber({}, { message: 'width phải là số' })
  width: number;

  @ApiProperty({ example: 8 })
  @Type(() => Number)
  @IsNumber({}, { message: 'height phải là số' })
  height: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt({ message: 'groupIndex phải là số nguyên' })
  groupIndex: number;

  @ApiPropertyOptional({ example: 'Nhân' })
  @IsOptional()
  @IsString({ message: 'label phải là chuỗi kí tự' })
  label?: string;
}
```
Trong `ConfirmWordDto`, thêm:
```ts
  @ApiPropertyOptional({ type: [OcclusionMaskDto] })
  @IsOptional()
  @IsArray({ message: 'masks phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => OcclusionMaskDto)
  masks?: OcclusionMaskDto[];
```
(`fields` đã có sẵn, dùng để chứa `Text`/`Extra` của Cloze — không cần thêm gì.)

### 2.3 `note.error.ts`
```ts
static invalidClozeSyntax() {
  return new BadRequestException('Nội dung Cloze phải chứa ít nhất 1 vùng ẩn dạng {{c1::...}}');
}
static invalidOcclusionMasks() {
  return new BadRequestException('Image Occlusion cần ít nhất 1 vùng che');
}
```

### 2.4 `note.service.ts`

Thêm helper (đặt cạnh class hoặc trong constant file):
```ts
private extractClozeIndices(text: string): number[] {
  const indices = new Set<number>();
  let match;
  const regex = new RegExp(CLOZE_MARKER_REGEX);
  while ((match = regex.exec(text)) !== null) {
    indices.add(Number(match[1]));
  }
  return [...indices].sort((a, b) => a - b);
}
```

Trong `confirm()`, **trước** đoạn build `cardTemplateMap`, thêm bước lấy `type` của từng template và tính `variantIndices` cho mỗi item cần tạo:

```ts
// Lấy đủ thông tin type của các template dùng để tạo mới
const templateInfos = await Promise.all(
  createTemplateIds.map((tid) => this.noteTemplateService.findById(tid)),
);
const templateTypeMap = new Map(templateInfos.map((t) => [t.id, t.type]));

// Validate + tính variantIndices cho từng word cần tạo
const itemsWithVariants = toCreate.map((w) => {
  const type = templateTypeMap.get(w.templateId!);
  if (type === 'CLOZE') {
    const text = (w.fields?.Text as string) ?? '';
    const indices = this.extractClozeIndices(text);
    if (indices.length === 0) throw NoteError.invalidClozeSyntax();
    return { ...w, variantIndices: indices };
  }
  if (type === 'IMAGE_OCCLUSION') {
    if (!w.masks || w.masks.length === 0) throw NoteError.invalidOcclusionMasks();
    const indices = [...new Set(w.masks.map((m) => m.groupIndex))].sort((a, b) => a - b);
    return { ...w, variantIndices: indices };
  }
  return { ...w, variantIndices: null }; // BASIC/BASIC_REVERSED — dùng cardTemplateMap như cũ
});
```

Truyền `itemsWithVariants` (thay vì `toCreate`) xuống `this.repo.createBatch(...)`.

> ⚠️ Cần xác nhận `NoteTemplateService` có hàm `getById(id): Promise<{id, type, fieldNames}>`. Nếu chưa có, thêm vào `note-template.service.ts` + `note-template.repository.ts` theo đúng convention (`findById` ở repo, service gọi và throw nếu không tồn tại).

### 2.4b — Bug cần vá: audio job bị sinh thừa cho note Cloze/Occlusion
Cuối `confirm()`, đoạn:
```ts
const audioJobs = created.filter((n) => !n.audioUrl);
if (audioJobs.length) {
  await this.noteAudioProducer.addBulk(
    audioJobs.map((n) => ({ noteId: n.id, word: n.word ?? '', language: n.languageId })),
  );
}
```
Note Cloze/Occlusion **không có `word`** (dùng `fields.Text` hoặc `imageUrl`) → nếu không lọc, mỗi note Cloze/Occlusion tạo mới sẽ bị đẩy 1 job TTS với text rỗng (`word: ''`), tốn tài nguyên vô ích và có thể lỗi ở `tts.service.ts`. Cần lọc thêm theo type trước khi đẩy job:
```ts
const audioJobs = created.filter((n) => {
  if (!n.word) return false; // không có word → không cần audio
  return !n.audioUrl;
});
```

### 2.5 `note.repository.ts`

Sửa `createBatch`:
- Thêm `variantIndices: number[] | null` và `masks?: OcclusionMaskDto[]` vào type của `items`.
- Sau khi `tx.note.createMany(...)`, thay đoạn sinh `cardData` bằng logic rẽ nhánh:

```ts
const cardData: any[] = [];
const maskData: any[] = [];

notes.forEach((n, i) => {
  const item = items[i];
  const ctIds = cardTemplateMap[n.templateId] ?? [];

  if (item.variantIndices === null) {
    // BASIC / BASIC_REVERSED — giữ nguyên logic cũ
    ctIds.forEach((ctId) => {
      cardData.push({
        id: crypto.randomUUID(), userId, noteId: n.id,
        cardTemplateId: ctId, deckId, variantIndex: null,
      });
    });
  } else {
    // CLOZE / IMAGE_OCCLUSION — 1 Card cho mỗi variant index, dùng CardTemplate đầu tiên
    const ctId = ctIds[0];
    item.variantIndices!.forEach((idx: number) => {
      cardData.push({
        id: crypto.randomUUID(), userId, noteId: n.id,
        cardTemplateId: ctId, deckId, variantIndex: idx,
      });
    });

    if (item.masks?.length) {
      item.masks.forEach((m: any) => {
        maskData.push({
          id: crypto.randomUUID(), noteId: n.id,
          x: m.x, y: m.y, width: m.width, height: m.height,
          groupIndex: m.groupIndex, label: m.label ?? null,
        });
      });
    }
  }
});

if (cardData.length) await tx.card.createMany({ data: cardData });
if (maskData.length) await tx.occlusionMask.createMany({ data: maskData });
```

> Lưu ý `fields` (chứa `Text`/`Extra`) đã được lưu vào `Note.fields` ở đoạn `notes.map(...)` phía trên — không cần sửa thêm.

### 2.6 `note-template.service.ts` (nếu chưa có `getById`)
```ts
async getById(id: string) {
  const template = await this.repo.findById(id);
  if (!template) throw NoteTemplateError.notFound();
  return template;
}
```

---

## PHASE 3 — Backend: Card / Study module (đã audit code thật)

> `study-session.*` không cần sửa gì — logic FSRS/SM2 và review log không phụ thuộc `variantIndex`. Chỉ sửa `card.repository.ts` + `card.service.ts` + `card.dto.ts`.

### 3.0 Bug hiện tại cần biết trước khi sửa
`card.service.ts::toResponse()` có hàm `render()`:
```ts
const render = (html: string) => html.replace(/\{\{(\w+)\}\}/g, (_, key) => fieldMap[key] ?? `{{${key}}}`);
```
Regex `\{\{(\w+)\}\}` **không khớp** `{{cloze:Text}}` (vì `\w+` không chứa dấu `:`) → hiện tại nếu ôn tập 1 thẻ Cloze, `frontHtml` trả về nguyên văn `{{cloze:Text}}` chưa render. Đây là lý do bắt buộc viết hàm render riêng cho Cloze/Occlusion thay vì tái dùng `render()` chung.

### 3.1 `card.dto.ts` — đã xác nhận. `CardResponseDto` là class thường, KHÔNG dùng `@ApiProperty` (khác style DTO khác trong repo — giữ nguyên convention này). Thêm:
```ts
export class CardResponseDto {
  id: string;
  noteId: string;
  deckId: string;
  cardTemplateId: string;
  state: CardState;
  due: Date;
  variantIndex?: number | null;        // MỚI
  frontHtml: string;
  backHtml: string;
  css: string;
  occlusion?: {                        // MỚI — chỉ có khi note.template.type === IMAGE_OCCLUSION
    imageUrl: string;
    masks: { x: number; y: number; width: number; height: number; groupIndex: number; label?: string | null }[];
  };
  note: {
    word?: string | null;
    meaning?: string | null;
    ipa?: string | null;
    partOfSpeech?: string | null;
    example?: string | null;
    audioUrl?: string | null;
    imageUrl?: string | null;
  };
}
```

### 3.2 `card.repository.ts`
Thêm vào `cardWithNoteSelect`:
```ts
const cardWithNoteSelect = {
  id: true,
  noteId: true,
  deckId: true,
  cardTemplateId: true,
  variantIndex: true,          // MỚI
  state: true,
  due: true,
  note: {
    select: {
      word: true, meaning: true, ipa: true, partOfSpeech: true, example: true,
      audioUrl: true, imageUrl: true, fields: true, templateId: true,
      template: { select: { type: true } },         // MỚI — biết note thuộc type gì
      occlusionMasks: {                               // MỚI — chỉ có data nếu type IMAGE_OCCLUSION
        select: { x: true, y: true, width: true, height: true, groupIndex: true, label: true },
      },
    },
  },
  cardTemplate: { select: { id: true, name: true, frontHtml: true, backHtml: true, css: true } },
} satisfies Prisma.CardSelect;
```
Áp dụng select mới này cho **cả 2 chỗ** dùng `cardWithNoteSelect` (`findDueCards`, `findByDeck`) và `findById` (đã spread `...cardWithNoteSelect` sẵn — tự động có).

### 3.3 `card.service.ts` — tách `toResponse()` thành 3 nhánh theo `note.template.type`

Thêm constant dùng chung (đặt ở `card.constant.ts`):
```ts
const CLOZE_MARKER_REGEX = /\{\{c(\d+)::(.*?)\}\}/g;
```

Sửa `toResponse`:
```ts
private toResponse(card: any): CardResponseDto {
  const note = card.note;
  const noteType = note.template?.type;

  if (noteType === 'CLOZE') return this.toClozeResponse(card, note);
  if (noteType === 'IMAGE_OCCLUSION') return this.toOcclusionResponse(card, note);
  return this.toBasicResponse(card, note); // logic render() hiện tại, giữ nguyên, đổi tên hàm
}

private toClozeResponse(card: any, note: any): CardResponseDto {
  const text = (note.fields?.Text as string) ?? '';
  const extra = (note.fields?.Extra as string) ?? '';
  const revealIndex = card.variantIndex;

  const renderSide = (side: 'front' | 'back') =>
    text.replace(new RegExp(CLOZE_MARKER_REGEX), (_m, idxStr: string, content: string) => {
      const idx = Number(idxStr);
      if (idx !== revealIndex) return content; // cloze KHÁC index của card này → hiện bình thường, không che
      return side === 'back'
        ? `<b class="cloze-reveal">${content}</b>`
        : `<span class="cloze">[...]</span>`;
    });

  const template = card.cardTemplate;
  return {
    id: card.id, noteId: card.noteId, deckId: card.deckId, cardTemplateId: card.cardTemplateId,
    state: card.state, due: card.due, variantIndex: card.variantIndex,
    frontHtml: renderSide('front'),
    backHtml: extra ? `${renderSide('back')}<hr class="my-3"/>${extra}` : renderSide('back'),
    css: template.css,
    note: { word: note.word, meaning: note.meaning, imageUrl: note.imageUrl, audioUrl: note.audioUrl },
  };
}

private toOcclusionResponse(card: any, note: any): CardResponseDto {
  const template = card.cardTemplate;
  return {
    id: card.id, noteId: card.noteId, deckId: card.deckId, cardTemplateId: card.cardTemplateId,
    state: card.state, due: card.due, variantIndex: card.variantIndex,
    frontHtml: '', backHtml: '', css: template.css, // FE tự render qua OcclusionCardView, không dùng HTML string
    occlusion: { imageUrl: note.imageUrl, masks: note.occlusionMasks },
    note: { word: note.word, meaning: note.meaning, imageUrl: note.imageUrl, audioUrl: note.audioUrl },
  };
}

private toBasicResponse(card: any, note: any): CardResponseDto {
  // ...giữ NGUYÊN 100% code toResponse() cũ (đoạn build fieldMap + render + return)...
}
```

---

## PHASE 4 — Frontend: Tạo note (`recalio`)

### 4.1 `note.schema.ts` — thêm schema mask
```ts
export const occlusionMaskSchema = z.object({
    x: z.number(), y: z.number(), width: z.number(), height: z.number(),
    groupIndex: z.number().int(),
    label: z.string().optional(),
});

// Trong confirmNoteSchema -> words item, thêm:
    masks: z.array(occlusionMaskSchema).optional(),
```

### 4.2 `components/deck/cloze-editor.tsx` (component mới)
- Textarea cho "Text" + nút "Cloze (cN)" — bôi đen từ → wrap `{{cN::...}}`.
- Giữ `Shift` khi bấm nút để dùng lại cùng index hiện tại (nhóm nhiều chỗ ẩn chung 1 Card, giống Anki `Ctrl+Alt+Shift+C`).
- Input riêng cho "Extra".
- Output: `{ Text: string, Extra: string }` → set vào `fields` của note.

### 4.3 `components/deck/image-occlusion-editor.tsx` (component mới)
- Upload ảnh trước (dùng lại `cloudinaryService.upload` có sẵn trong `manual-tab.tsx`).
- SVG/div overlay: kéo chuột vẽ hình chữ nhật → thành 1 mask với `groupIndex` tự tăng.
- Giữ `Shift` khi vẽ để nhóm vào `groupIndex` hiện tại (nhiều vùng cùng ẩn 1 lúc).
- Click vào mask đã vẽ để xoá hoặc sửa `label`.
- Output: `OcclusionMask[]` → gửi lên `masks` trong payload.

### 4.4 `manual-tab.tsx`
- Fetch template kèm `type` (đã có sẵn trong `useNoteTemplates`, chỉ cần đảm bảo BE trả field này — kiểm tra `NoteTemplateResponseDto`).
- Thêm state `fields: Record<string, string>` và `masks: OcclusionMask[]`.
- Render form theo `selectedTemplate.type`:
  - `CLOZE` → `<ClozeEditor />`
  - `IMAGE_OCCLUSION` → `<ImageOcclusionEditor />`
  - còn lại → form hiện tại (word/ipa/meaning/example)
- `handleSave` — build payload theo nhánh:
```ts
const basePayload = { languageId, templateId, tags: tags.length ? tags : undefined };
const payload = selectedTemplate.type === "CLOZE"
    ? { ...basePayload, fields }
    : selectedTemplate.type === "IMAGE_OCCLUSION"
    ? { ...basePayload, imageUrl, masks }
    : { ...basePayload, word, meaning, ipa, partOfSpeech, example, audioUrl, imageUrl };
```

### 4.5 `card-preview.tsx` — preview lúc SOẠN note (không phải lúc ôn tập)
Giữ nguyên logic hiện tại (ẩn hết cN cùng lúc) — preview lúc tạo note **không cần** mô phỏng đúng từng Card, chỉ cần xem tổng quan nội dung đã nhập đúng chưa. Chỉ cần đảm bảo `buildFieldMap` đọc từ `fields`:
```ts
Text: data.fields?.Text ?? data.word,
Extra: data.fields?.Extra ?? data.example ?? "",
```

### 4.6 Bỏ filter loại Cloze khỏi `ai-generate-from-topic-tab.tsx`?
**Không cần đổi** — giữ nguyên filter, vì flow AI-generate-from-topic sinh hàng loạt từ vựng đơn giản, không hợp để tạo Cloze/Occlusion (cần thao tác tay). Chỉ `manual-tab.tsx` hỗ trợ 2 loại này.

---

## PHASE 5 — Frontend: Ôn tập (`app/study/[deckId]/page.tsx` — component `StudySessionPage`)

Vì `card.service.ts` đã render sẵn `frontHtml`/`backHtml` cho BASIC/BASIC_REVERSED **và cả CLOZE** (server-side, Phase 3.3), pipeline client hiện tại (`buildFieldMap` → `processBackHtml`) **không cần đổi** — nó sẽ chỉ no-op trên HTML đã resolve sẵn từ BE (an toàn, không có `{{...}}` nào còn sót để thay).

**Chỉ cần thêm nhánh `IMAGE_OCCLUSION`** ở đúng 2 nơi đang render `frontHtml`/`backHtml` trực tiếp:

### 5.1 Card chính đang ôn tập (trong `StudySessionPage`, ~dòng 358-383)
```tsx
<div className="absolute inset-0 flex flex-col items-center justify-center p-8 [backface-visibility:hidden]">
    {currentCard?.occlusion ? (
        <OcclusionCardView
            imageUrl={currentCard.occlusion.imageUrl}
            masks={currentCard.occlusion.masks}
            variantIndex={currentCard.variantIndex}
            side="front"
        />
    ) : (
        <div
            className="w-full text-center [&_img]:max-h-48 [&_img]:rounded-xl [&_img]:object-cover"
            dangerouslySetInnerHTML={{ __html: currentCard?.frontHtml || "" }}
        />
    )}
    <style>{currentCard?.css}</style>
    <p className="mt-6 text-xs font-medium text-text-muted">Chạm để lật thẻ</p>
</div>
<div className="absolute inset-0 flex flex-col items-center justify-center p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
    {currentCard?.occlusion ? (
        <OcclusionCardView
            imageUrl={currentCard.occlusion.imageUrl}
            masks={currentCard.occlusion.masks}
            variantIndex={currentCard.variantIndex}
            side="back"
        />
    ) : (
        <div
            className="w-full text-center [&_img]:max-h-48 [&_img]:rounded-xl [&_img]:object-cover"
            dangerouslySetInnerHTML={{ __html: processedBackHtml }}
        />
    )}
    <style>{currentCard?.css}</style>
    {/* ...giữ nguyên phần answerResult cho Type Answer... */}
</div>
```
> Giữ nguyên toàn bộ phần còn lại (nút rating, `isTypeAnswer`, input gõ đáp án...) — Cloze/Occlusion không dùng Type Answer nên các nhánh đó tự động không kích hoạt (`hasTypeMarker` sẽ trả `false` vì `backHtml` của Cloze không còn chứa `{{type:}}`, và Occlusion thì `backHtml` rỗng).

### 5.2 Component `CardPreview` cục bộ (dòng ~62-87, dùng cho lưới "Tất cả thẻ trong deck")

> ⚠️ Lưu ý đặt tên: component này **trùng tên** với `card-preview.tsx` bên `manual-tab.tsx` nhưng là 2 file hoàn toàn khác nhau (1 cái local trong `page.tsx`, 1 cái import riêng). AI coding cần sửa đúng file `page.tsx` này, không phải `components/deck/card-preview.tsx`.

```tsx
function CardPreview({ card, compact }: { card: any; compact?: boolean }) {
    const [showBack, setShowBack] = useState(false)
    const fieldMap = useMemo(() => buildFieldMap(card), [card])
    const backHtml = useMemo(() => processBackHtml(card?.backHtml ?? "", fieldMap), [card, fieldMap])
    return (
        <div onClick={() => setShowBack((v) => !v)} className={/* giữ nguyên */}>
            <div className={/* giữ nguyên */}>
                <div className="absolute inset-0 flex items-center justify-center p-3 [backface-visibility:hidden]">
                    {card?.occlusion ? (
                        <OcclusionCardView imageUrl={card.occlusion.imageUrl} masks={card.occlusion.masks} variantIndex={card.variantIndex} side="front" compact />
                    ) : (
                        <div className={/* giữ nguyên className */} dangerouslySetInnerHTML={{ __html: card?.frontHtml ?? "" }} />
                    )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {card?.occlusion ? (
                        <OcclusionCardView imageUrl={card.occlusion.imageUrl} masks={card.occlusion.masks} variantIndex={card.variantIndex} side="back" compact />
                    ) : (
                        <div className={/* giữ nguyên className */} dangerouslySetInnerHTML={{ __html: backHtml }} />
                    )}
                </div>
            </div>
        </div>
    )
}
```

### 5.3 Component mới `OcclusionCardView` — đặt cùng file `page.tsx` (cạnh `CardPreview` local) hoặc tách file riêng `components/study/occlusion-card-view.tsx`
```tsx
function OcclusionCardView({ imageUrl, masks, variantIndex, side, compact }: {
    imageUrl: string
    masks: { x: number; y: number; width: number; height: number; groupIndex: number; label?: string | null }[]
    variantIndex: number | null | undefined
    side: "front" | "back"
    compact?: boolean
}) {
    return (
        <div className="relative inline-block max-w-full">
            <img src={imageUrl} className={`block max-w-full rounded-lg object-contain ${compact ? "max-h-24" : "max-h-48"}`} />
            {masks.map((m, i) => {
                const isTarget = m.groupIndex === variantIndex
                if (side === "back" && isTarget) return null // lộ đúng vùng của card này khi lật Back
                return (
                    <div
                        key={i}
                        className="absolute flex items-center justify-center rounded-sm bg-terracotta/90 text-[10px] font-bold text-white"
                        style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.width}%`, height: `${m.height}%` }}
                    />
                )
            })}
        </div>
    )
}
```
Mode mặc định: **Hide All, Guess One** — mọi mask luôn tô đặc ở cả 2 mặt, chỉ mask đúng `variantIndex` biến mất khi `side === "back"`.

### 5.4 `schemas/card.schema.ts` (nếu tồn tại — chưa xem qua)
Nếu FE có zod schema riêng cho Card (giống `note.schema.ts`), thêm `variantIndex` và `occlusion` vào đó để có type-safety đầy đủ. Hiện trang này dùng `card: any` nên **không bắt buộc** phải sửa để chạy được, chỉ nên làm nếu muốn strict-type.

---

## Giới hạn phạm vi (cố ý KHÔNG làm trong spec này)

- **Sửa (PATCH) 1 note Cloze/Occlusion đã tồn tại và đổi số lượng vùng ẩn** (thêm/bớt `{{cN::}}` hoặc mask) → **không** tự động sinh thêm/xoá Card tương ứng. Nhánh `toUpdate` trong `note.service.ts::confirm()` hiện chỉ update `fields`/`masks`, không đụng tới bảng Card. Đây là giới hạn **cố ý** cho bản MVP — Anki thật cũng xử lý phần này khá phức tạp (giữ lịch sử review của card bị xoá mất marker thay vì xoá thẳng). Nếu cần, làm ở 1 spec riêng sau.
- **Không hỗ trợ mode "Hide One, Guess One"** cho Image Occlusion (các vùng khác luôn hiện rõ, chỉ ẩn đúng 1 vùng) — chỉ làm "Hide All, Guess One" (mặc định của Anki, đơn giản hơn).
- **Không đồng bộ lại `card.variantIndex`** nếu 2 lần confirm cùng 1 note tạo cloze index trùng nhau nhưng nội dung khác — trường hợp này không xảy ra vì mỗi lần `confirm` không có `id` luôn tạo **note mới**, không phải update.

---

## Checklist thứ tự thực hiện cho AI coding agent

- [ ] Phase 1: migration schema (chạy `prisma migrate dev`, kiểm tra generate client thành công)
- [ ] Phase 2: sửa note module (dto, service, repository, error) — build phải qua `npx tsc --noEmit`
- [ ] Test bằng Postman/Swagger: tạo 1 note Cloze với `fields.Text = "Paris là {{c1::thủ đô}} của {{c2::Pháp}}"` → xác nhận sinh đúng 2 Card, `variantIndex` = 1 và 2
- [ ] Test tạo 1 note Image Occlusion với 2 mask (`groupIndex` 1 và 2) → xác nhận sinh đúng 2 Card + 2 row `occlusion_masks`
- [ ] Phase 3: sửa `card.repository.ts`, `card.service.ts`, `card.dto.ts` — build phải qua `npx tsc --noEmit`
- [ ] Test `GET /cards/due`: card Cloze phải trả `frontHtml` đã che đúng 1 index, card khác trong cùng note không bị che
- [ ] Phase 4: `ClozeEditor`, `ImageOcclusionEditor`, sửa `manual-tab.tsx`, `card-preview.tsx`
- [ ] Phase 5: sửa `app/study/[deckId]/page.tsx` (thêm `OcclusionCardView`)
- [ ] Test end-to-end: tạo 1 note Cloze + 1 note Image Occlusion qua UI → vào `/study/[deckId]` ôn thử, kiểm tra Front che đúng, Back lộ đúng

---

## Tổng kết file sẽ bị sửa

**Backend (`recalio_backend`):**
- `prisma/schema.prisma`
- `src/modules/note/note.dto.ts`, `note.service.ts`, `note.repository.ts`, `note.error.ts`
- `src/modules/card/card.repository.ts`, `card.service.ts`, `card.dto.ts`

**Frontend (`recalio`):**
- `schemas/note.schema.ts`
- `components/deck/cloze-editor.tsx` (mới)
- `components/deck/image-occlusion-editor.tsx` (mới)
- `app/deck/[id]/create-notes/manual-tab.tsx`
- `app/deck/[id]/create-notes/card-preview.tsx`
- `app/study/[deckId]/page.tsx`

Đã đủ toàn bộ file cần thiết — sẵn sàng đưa nguyên file spec này cho AI coding agent làm theo checklist trên.
