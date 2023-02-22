export interface SuccessResponse<T = any> {
    statusCode: 200
    data: T
}

export interface ErrorResponse {
    statusCode: 400
    message?: string
}

export type Response<U = any> = ErrorResponse | SuccessResponse<U>

export type RequestFunction<T = any, U = any> = (data: T) => Promise<Response<U>>
