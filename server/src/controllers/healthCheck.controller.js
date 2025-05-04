import { ApiResponse } from '../utils/api-response.js'

export const healthCheckController = async (req, res) => {
    res.status(200).json(new ApiResponse(200, {}, "Server is running"))
}