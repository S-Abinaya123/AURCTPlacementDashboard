export const response = (condition, message, data = {}) => {
    const res = {
        condition: condition.toUpperCase(),
        message: message,
        data: data
    }
    return res;
}