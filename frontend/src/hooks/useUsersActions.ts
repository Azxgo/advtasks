import { apiClient } from "../config/apiClient"

export function useUsersActions() {

    const resetStats = async () => {
        try {
            const res = await apiClient("/api/users/resetStats", {
                method: "PATCH"
            })

            if (!res.ok) {
                throw new Error()
            }
        } catch (e) {

        }
    }

    return {
        resetStats
    }
}