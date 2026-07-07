// "use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { GenderType } from "@/constants/type";
// import { cn } from "@/utils/cn";

// const DEFAULT_AVATAR_MALE = "https://i.pinimg.com/1200x/44/be/0b/44be0b0016c6eaa7edfc2a2e2c4a5e33.jpg";
// const DEFAULT_AVATAR_FEMALE = "https://i.pinimg.com/1200x/60/33/23/603323075ee7f7c1b7c4a1f600ea4b2d.jpg";
// const DEFAULT_AVATAR_UNKNOWN = "https://i.pinimg.com/1200x/b0/04/15/b00415e91c40412dcd9c98c96f52be04.jpg";

// interface UserAvatarProps {
//     avatarUrl?: string | null;
//     gender?: string | null;
//     fullName?: string | null;
//     username?: string;
//     className?: string;
// }

// export function UserAvatar({
//     avatarUrl,
//     gender,
//     fullName,
//     username,
//     className,
// }: UserAvatarProps) {

//     // Sửa logic xác định ảnh mặc định theo đúng 3 loại giới tính
//     const getDefaultAvatar = () => {
//         if (gender === GenderType.MALE) return DEFAULT_AVATAR_MALE;
//         if (gender === GenderType.FEMALE) return DEFAULT_AVATAR_FEMALE;
//         return DEFAULT_AVATAR_UNKNOWN;
//     };

//     // Hàm lấy chữ viết tắt chuẩn UX (Ví dụ: "Nguyễn Hoàng Nam" -> "NN")
//     const getFallbackText = () => {
//         const name = fullName || username;
//         if (!name) return "??";

//         const words = name.trim().split(/\s+/);
//         if (words.length === 1) return words[0].substring(0, 2).toUpperCase();

//         // Lấy chữ cái đầu của từ đầu tiên và từ cuối cùng
//         return (words[0][0] + words[words.length - 1][0]).toUpperCase();
//     };

//     return (
//         <Avatar className={cn("size-10 border border-gray-100 shadow-sm shrink-0", className)}>
//             <AvatarImage
//                 src={avatarUrl || getDefaultAvatar()}
//                 alt={fullName || username || "User avatar"}
//                 className="object-cover w-full h-full"
//             />
//             <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase select-none">
//                 {getFallbackText()}
//             </AvatarFallback>
//         </Avatar>
//     );
// }