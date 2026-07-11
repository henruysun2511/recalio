# RECALIO Frontend — Coding Convention & Pattern Reference

> Tra cứu file này trước khi viết code mới để đảm bảo nhất quán.

---

## 1. Cấu trúc thư mục

```
src/
  app/                          # Next.js App Router
    (user)/deck/page.tsx        # User pages
    admin/language/page.tsx     # Admin pages
    auth/login/page.tsx         # Auth pages
    layout.tsx                  # Root layout (providers)
    globals.css                 # Tailwind v4 + theme + utilities
  components/
    common/                     # DeckCard, DataTable, ConfirmDialog, EmptyState, Title, ...
    ui/                         # shadcn/ui primitives (button, dialog, form, input, ...)
    admin/                      # AdminSidebar, AdminSidebarRight
    user/                       # UserSidebar, UserHeader
    providers/                  # AuthProvider, QueryProvider
  constants/
    type.ts                     # Enums (UserRole, CardState, ReportReason, ...)
    sort.ts                     # SortOrder, DeckSortBy, CardSortBy, ...
    apiResponse.ts              # ApiResponse<T> interface
    pagination.ts               # Pagination interface
  services/                     # {entity}.service.ts (default export, const prefix)
  schemas/                      # {entity}.schema.ts (zod + types)
  queries/                      # use{Entity}Query.ts (TanStack Query hooks)
  hooks/                        # useImageUpload.ts, use-mobile.ts
  stores/                       # useAuthStore.ts (zustand + persist)
  utils/
    http.ts                     # GET/POST/PATCH/DELETE wrapper
    axios.ts                    # Axios instance + interceptors (auth, refresh queue)
    handleError.ts              # Toast-based error handler
    middleware.ts               # Next.js middleware (role-based routing)
  lib/
    utils.ts                    # cn() utility (clsx + tailwind-merge)
```

---

## 2. File naming

| Directory | Pattern | Ví dụ |
|-----------|---------|-------|
| `services/` | `{entity}.service.ts` | `deck.service.ts`, `auth.service.ts` |
| `schemas/` | `{entity}.schema.ts` | `deck.schema.ts`, `auth.schema.ts` |
| `queries/` | `use{Entity}Query.ts` | `useDeckQuery.ts`, `useAuthQuery.ts` |
| `hooks/` | `use{camelCase}.ts` hoặc `use-mobile.ts` | `useImageUpload.ts` |
| `stores/` | `use{Name}Store.ts` | `useAuthStore.ts` |
| `components/common/` | kebab-case | `deck-card.tsx`, `data-table.tsx` |
| `components/ui/` | 1 word | `button.tsx`, `dialog.tsx` |
| Page files | `page.tsx` | luôn là `page.tsx` |
| Layout files | `layout.tsx` | chỉ trong route group |

---

## 3. Import thứ tự

```
// 1. External libraries
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { z } from "zod"
import { toast } from "sonner"
import { MoreHorizontal, PlusIcon } from "lucide-react"

// 2. components/ui (shadcn primitives)
import { Button } from "@/components/ui/button"

// 3. components/common (reusable)
import { DataTable } from "@/components/common/data-table"

// 4. components/{role} (admin/user)
import { UserHeader } from "@/components/user/user-header"

// 5. providers
import { AuthProvider } from "@/components/providers/auth-provider"

// 6. constants
import { UserRole } from "@/constants/type"
import { SortOrder } from "@/constants/sort"

// 7. queries
import { useMyDecks } from "@/queries/useDeckQuery"

// 8. services (rare, only when bypassing query hook)
import reportService from "@/services/report.service"

// 9. schemas
import { type DeckResponse } from "@/schemas/deck.schema"

// 10. stores
import { useAuthStore } from "@/stores/useAuthStore"

// 11. hooks
import { useImageUpload } from "@/hooks/useImageUpload"

// 12. utils
import { handleError } from "@/utils/handleError"
import { cn } from "@/lib/utils"
```

Luôn dùng `@/` alias, không dùng relative `../../`.

---

## 4. Service pattern

```typescript
import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { CreateDeckInput, DeckParams, DeckResponse, UpdateDeckInput } from "@/schemas/deck.schema";
import { Pagination } from "@/constants/pagination";

const prefix = "/decks";

const deckService = {
    // GET list (có pagination)
    listPublic: (params?: DeckParams) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>(prefix, { params });
    },

    // GET by id
    getById: (id: string) => {
        return http.get<ApiResponse<DeckResponse>>(`${prefix}/${id}`);
    },

    // POST create
    create: (data: CreateDeckInput) => {
        return http.post<ApiResponse<DeckResponse>>(prefix, data);
    },

    // PATCH update
    update: (id: string, data: UpdateDeckInput) => {
        return http.patch<ApiResponse<DeckResponse>>(`${prefix}/${id}`, data);
    },

    // DELETE
    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`${prefix}/${id}`);
    },

    // PATCH với body
    move: (id: string, data: MoveDeckInput) => {
        return http.patch<ApiResponse<DeckResponse>>(`${prefix}/${id}/move`, data);
    },
};

export default deckService;   // default export
```

**Quy tắc:**
- `default export` service object
- `const prefix = "/entity"` ở đầu file
- List có pagination: `ApiResponse<T[]> & { meta?: Pagination }`
- List trả về object (không phải array): định nghĩa local interface `XxxListResponse`

---

## 5. Schema pattern (Zod)

```typescript
import { z } from "zod"
import { ReportReason } from "@/constants/type"
import { SortOrder } from "@/constants/sort"

// 1. Response schema
export const postCommentSchema = z.object({
    id: z.string().uuid(),
    postId: z.string().uuid(),
    userId: z.string().uuid(),
    content: z.string(),
    parentId: z.string().uuid().nullable(),
    likeCount: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    user: z.object({ id: z.string().uuid(), username: z.string(), displayName: z.string(), avatarUrl: z.string().nullable() }).optional(),
    replies: z.array(z.any()).optional(),
})

export type PostComment = z.infer<typeof postCommentSchema>

// 2. Create input schema (validation)
export const createCommentSchema = z.object({
    content: z.string().min(1, "Nội dung không được để trống").max(2000, "Nội dung tối đa 2000 kí tự"),
    parentId: z.string().uuid().optional(),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>

// 3. Update input schema (all optional)
export const updateCommentSchema = z.object({
    content: z.string().min(1).max(2000),
})

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>

// 4. Query params (plain interface, không dùng zod)
export interface CommentQuery {
    page?: number
    limit?: number
}
```

**Quy tắc:**
- Response schema dùng `z.object()`, export type `z.infer<>`
- Create schema: required fields + `min/max` error messages Tiếng Việt
- Update schema: tất cả field đều `.optional()`
- Params/filter dùng plain `interface` (không zod)
- `z.nativeEnum(Enum)` cho TypeScript enum
- `z.coerce.number()` cho query params từ string
- Recursive type (comments → replies): dùng `z.array(z.any())` thay vì `z.lazy()` (Zod v4 không hỗ trợ)

---

## 6. Query hook pattern (TanStack Query)

```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import deckService from "@/services/deck.service";
import { CreateDeckInput, DeckParams, UpdateDeckInput } from "@/schemas/deck.schema";

export const DECK_QUERY_KEY = ["decks"];

// useQuery
export const useMyDecks = (params?: DeckParams) => {
    return useQuery({
        queryKey: [...DECK_QUERY_KEY, "mine", params],
        queryFn: async () => {
            const res = await deckService.listMine(params);
            return res.data;
        },
    });
};

// useQuery với enabled guard
export const useDeck = (id: string) => {
    return useQuery({
        queryKey: [...DECK_QUERY_KEY, id],
        queryFn: async () => {
            const res = await deckService.getById(id);
            return res.data;
        },
        enabled: !!id,
    });
};

// useMutation — create
export const useCreateDeck = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateDeckInput) => deckService.create(data),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEY }); },
    });
};

// useMutation — update (id + data)
export const useUpdateDeck = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDeckInput }) => deckService.update(id, data),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEY }); },
    });
};

// useMutation — delete (chỉ id)
export const useDeleteDeck = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deckService.delete(id),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEY }); },
    });
};
```

**Quy tắc:**
- `QUERY_KEY` là array constant, export được
- `queryKey: [...QUERY_KEY, "sub", params]` — cache hierarchy
- `queryFn` luôn trả `res.data` (unwrap ApiResponse)
- `useMutation` KHÔNG có toast/error handling trong hook
- `onSuccess` chỉ gọi `invalidateQueries`
- Toast + error xử lý ở page component qua `mutateAsync({...}, { onSuccess, onError })`

---

## 7. Component patterns

### DeckCard (card với dropdown)

```typescript
"use client"

interface DeckCardProps {
    deck: DeckResponse
    onEdit?: (deck: DeckResponse) => void   // optional callback
    onDelete?: (id: string) => void
    onClone?: (id: string) => void
    onReport?: (id: string) => void
}

export function DeckCard({ deck, onEdit, onDelete, onClone, onReport }: DeckCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-3xl border border-beige bg-white shadow-sm hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-md transition-all duration-300">
            {/* Cover image */}
            <div className="relative h-40 w-full overflow-hidden">
                {deck.coverImage ? (
                    <img src={deck.coverImage} alt={deck.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200/60">
                        <Folder className="size-7 text-white" fill="currentColor" />
                    </div>
                )}
                {/* 3-dot dropdown menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="absolute right-3 top-3 z-10 rounded-xl border border-neutral-200 bg-white shadow-sm opacity-70 group-hover:opacity-100">
                            <MoreHorizontal className="size-3.5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-28 rounded-xl">
                        {onEdit && <DropdownMenuItem onClick={() => onEdit(deck)}>Chỉnh sửa</DropdownMenuItem>}
                        {onClone && <DropdownMenuItem onClick={() => onClone(deck.id)}>Sao chép</DropdownMenuItem>}
                        {onDelete && <DropdownMenuItem onClick={() => onDelete(deck.id)} className="text-red-600">Xóa</DropdownMenuItem>}
                        {onReport && <DropdownMenuItem onClick={() => onReport(deck.id)} className="text-red-600">Tố cáo</DropdownMenuItem>}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {/* Content */}
            <div className="p-5">
                <h3 className="line-clamp-1 text-lg font-bold group-hover:text-terracotta">{deck.name}</h3>
                {deck.description && <p className="mt-3 line-clamp-2 text-sm text-text-muted">{deck.description}</p>}
                {/* Tags, footer stats... */}
            </div>
        </div>
    )
}
```

**Key points:**
- Named export, không default
- Props interface với optional callbacks
- Conditional render `{onEdit && <Item/>}`
- Destructive action: `text-red-600`
- `group-hover:` cho hiệu ứng cha-con

### Dialog với Form (shadcn Form)

```typescript
"use client";

export function LanguageDialog({ open, onOpenChange, onSubmit, initialData, loading }: LanguageDialogProps) {
    const schema = initialData ? updateLanguageSchema : createLanguageSchema;

    const form = useForm({ resolver: zodResolver(schema), defaultValues: { isSupported: false } });

    useEffect(() => {
        if (open) {
            if (initialData) form.reset({ ...initialData });
            else form.reset({ id: "", name: "", nativeName: "", flagEmoji: "", isSupported: false });
        }
    }, [initialData, form, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] admin-dialog-content"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="admin-dialog-header">
                    <div className="admin-dialog-icon-box bg-primary/5">
                        <GlobeIcon className="size-6 text-primary" />
                    </div>
                    <DialogTitle className="admin-dialog-title">{initialData ? "Chỉnh sửa" : "Thêm mới"}</DialogTitle>
                    <DialogDescription className="admin-dialog-description">{initialData ? "Cập nhật..." : "Thêm mới..."}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="admin-dialog-body">
                            <FormField control={form.control} name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Tên</FormLabel>
                                        <FormControl><Input className="admin-form-input" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="admin-dialog-footer">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="admin-btn-cancel">Hủy bỏ</Button>
                            <Button type="submit" disabled={loading} className="admin-btn-primary">
                                {loading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
```

**Key points:**
- `schema = initialData ? updateSchema : createSchema`
- `useEffect` reset form khi dialog mở
- `Form {...form}` wrap `<form>`, dùng `form.handleSubmit(onSubmit)`
- Mỗi field: `<FormField control={form.control} name="..." render={({field}) => <FormItem>...}`
- DialogHeader: icon box + title + description
- DialogFooter: cancel (ghost) + submit (primary) buttons
- Ngăn auto-focus: `onOpenAutoFocus`, `onCloseAutoFocus`

### DataTable (TanStack Table)

```typescript
"use client";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

export function DataTable<TData, TValue>({ columns, data, loading }: DataTableProps<TData, TValue>) {
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
    // render: header (bg-primary text-white) → body (loading / data / empty)
}
```

Column definitions là factory function (không export const):

```typescript
export const getColumns = ({ onEdit, onDelete }: ColumnProps): ColumnDef<Language>[] => [
    { accessorKey: "id", header: "Mã", cell: ({row}) => ... },
    { accessorKey: "isSupported", header: "Trạng thái", cell: ({row}) => <Badge>...</Badge> },
    { id: "actions", header: () => <div className="text-right pr-6">Thao tác</div>, cell: ({row}) => <DropdownMenu>...</DropdownMenu> },
];
```

### Common components

```typescript
// Title
<Title title="..." description="..." />

// EmptyState
<EmptyState title="..." description="..." actionLabel="Tạo mới" onAction={handleAdd} />

// PaginationInfo
<PaginationInfo page={1} limit={20} totalItems={100} currentLength={20} label="bộ thẻ" />

// DataPagination
<DataPagination page={1} totalPages={5} onPageChange={(p) => setState(p)} />

// ConfirmDialog
<ConfirmDialog open={open} onOpenChange={setOpen} onConfirm={handleDelete} loading={isPending} />
```

---

## 8. Page pattern (Admin & User)

Mọi page đều theo cấu trúc:

```
"use client"

1. State declarations (queries, mutations, dialog state)
2. Handler functions (handleXxx = async () => { try { mutateAsync(...) } })
3. Data transformation (data as any)
4. Render: heading → filter → [loading|empty|data+pagination] → dialogs
```

### Admin page

```typescript
export default function AdminLanguagePage() {
    const [query, setQuery] = useState<LanguageQuery>({});
    const { data, isLoading } = useLanguages(query);
    const createMutation = useCreateLanguage();
    const updateMutation = useUpdateLanguage();
    const deleteMutation = useDeleteLanguage();

    const handleSubmit = async (formData: any) => {
        try {
            if (editingLang) {
                await updateMutation.mutateAsync({ id: editingLang.id, data: formData }, {
                    onSuccess: (response: any) => { toast.success(response?.message || "Thành công"); setDialogOpen(false); },
                    onError: (error: any) => { handleError(error, "Thất bại"); },
                });
            } else {
                await createMutation.mutateAsync(formData, {
                    onSuccess: (response: any) => { toast.success(response?.message || "Thành công"); setDialogOpen(false); },
                    onError: (error: any) => { handleError(error, "Thất bại"); },
                });
            }
        } catch (error) { console.error(error); }
    };
    // ...
}
```

### User page

Tương tự nhưng dùng `Title` component, `EmptyState`, `DeckSkeleton`, `DataPagination`, `PaginationInfo`:

```typescript
const decks = ((data as any)?.data || []) as any[];
const meta = (data as any)?.meta as Pagination | undefined;
```

---

## 9. Toast & Error handling pattern

Chỉ dùng trong PAGE component, KHÔNG trong query hooks:

```typescript
// Success
toast.success(response?.message || "Thao tác thành công")

// Error
import { handleError } from "@/utils/handleError"
handleError(error, "Thông báo mặc định")
// → handleError đọc error.response?.data?.message || message || "Lỗi không xác định"
```

---

## 10. CSS conventions

- **Brand colors**: `terracotta` (primary), `cream` (bg), `beige` (border), `peach`, `peach-light`
- **Text colors**: `text-text-primary`, `text-text-muted`
- **Radius**: `rounded-3xl`, `rounded-4xl` (custom tokens)
- **Utility classes** (globals.css `@layer utilities`):
  - `admin-dialog-content`, `admin-dialog-header`, `admin-dialog-body`, `admin-dialog-footer`
  - `admin-dialog-icon-box`, `admin-dialog-title`, `admin-dialog-description`
  - `admin-form-label`, `admin-form-input`, `admin-field-card`
  - `admin-btn-cancel`, `admin-btn-primary`, `admin-btn-danger`
  - `auth-container`, `auth-card`, `form-input`, `form-label`, `form-btn`
- **Chrome autofill fix**: `-webkit-box-shadow: 0 0 0 100px #fff inset`
- **Flex scroll fix**: `min-h-0` trên parent + `overflow-y-auto` trên child
- **Không hardcode hex** trừ khi không có variable (ví dụ: `#D97D56` không dùng, phải là `bg-terracotta`)

---

## 11. Auth & Store

```typescript
// Zustand store (persisted)
export const useAuthStore = create<AuthState>()(persist(..., { name: "auth-storage" }));

// Dùng trong component
const { user, setAuth, logout } = useAuthStore();
```

**Axios interceptor pattern:** `src/utils/axios.ts` tự động gắn Bearer token từ store/cookie, tự động refresh token khi 401 (với queue để tránh gọi refresh nhiều lần).

---

## 12. Zod v4 notes

- `z.nativeEnum(Enum, { message: "..." })` — KHÔNG dùng `{ errorMap: () => ({ message }) }`
- `z.lazy()` gây lỗi implicit type any với recursive type → thay bằng `z.array(z.any())`
- `z.coerce.number()` cho query params

---

## 13. Tóm tắt quy tắc viết code mới

| Hạng mục | Quy tắc |
|----------|---------|
| Service | Tạo file `{entity}.service.ts`, default export, `const prefix = "/..."` |
| Schema | Tạo file `{entity}.schema.ts`, zod schema + type exports |
| Query | Tạo file `use{Entity}Query.ts`, query key + useQuery/useMutation |
| Component | Named export, optional callbacks, `"use client"` |
| Dialog | shadcn Form + zodResolver, `useEffect` reset form |
| Toast | Chỉ gọi trong page, trong `onSuccess`/`onError` của `mutateAsync` |
| Error | Dùng `handleError(error, fallbackMsg)` |
| CSS | Dùng utility classes từ globals.css, không hardcode hex |
| Import | `@/` alias, đúng thứ tự: react → ui → common → constants → queries → schemas |
