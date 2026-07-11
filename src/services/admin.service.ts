import { ApiResponse } from "@/constants/apiResponse"
import http from "@/utils/http"
import type { DashboardData } from "@/schemas/admin.schema"

const prefix = "/admin"

const adminService = {
    getDashboard: () => {
        return http.get<ApiResponse<DashboardData>>(`${prefix}/dashboard`)
    },
}

export default adminService
