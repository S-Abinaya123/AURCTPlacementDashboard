export const response = (status, message, data = {}) => {
    const res = {
        status: status.toUpperCase(),
        message: message,
        data: data
    }
    return res;
}