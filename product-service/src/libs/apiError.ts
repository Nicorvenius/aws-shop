import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
    statusCode: number;
    constructor(message: string = '', statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
    }
}
