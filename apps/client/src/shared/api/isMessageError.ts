export function isMessageError(
    data: unknown
): data is { message: string | string[] } {
    return typeof data === 'object' && data !== null && 'message' in data;
}
