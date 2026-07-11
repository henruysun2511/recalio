import { useQuery } from "@tanstack/react-query"
import adminService from "@/services/admin.service"

export const ADMIN_QUERY_KEY = ["admin"]

export const useDashboard = () => {
    return useQuery({
        queryKey: [...ADMIN_QUERY_KEY, "dashboard"],
        queryFn: async () => {
            const res = await adminService.getDashboard()
            return res.data
        },
    })
}
