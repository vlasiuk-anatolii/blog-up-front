export const getErrorMessage = (response: unknown) => {
    if (typeof response === 'object' && response !== null && 'message' in response) {
        if (Array.isArray(response.message)) {
            return formatErrorMessage(response.message[0]);
        }
        return formatErrorMessage((response as { message: string }).message);
    }
    return "Unknown error occurred!";
}

const formatErrorMessage = (message: string) => {
    return message.charAt(0).toUpperCase() + message.slice(1);
}