//import error class from Error class : NodeJS
class ApiError extends Error {
    constructor(statusCode, msg = "Something went wrong", error = "ERROR", stack = "") {
        super();
        this.statusCode = statusCode;
        this.error = error;
        this.message = msg;
        this.value = false;
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export { ApiError };