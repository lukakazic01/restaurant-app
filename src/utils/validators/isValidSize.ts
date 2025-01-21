export const isValidSize = (size: number) => {
    if (isNaN(size)) return { errorMessage: 'Number of guests must be a number', isValid: false };
    if (size < 1 || size> 10) return { errorMessage: 'Number of guests must be between 1 and 10', isValid: false };
    return { isValid: true, errorMessage: "" };
}