/**
 * Get a value from localStorage with type safety
 */
export const getStorageValue = <T extends string>(
    key: string,
    defaultValue: T,
    validator: (value: string) => T | null
): T => {
    if (typeof document === "undefined") return defaultValue;
    const stored = localStorage.getItem(key);
    if (stored) {
        const validated = validator(stored);
        if (validated !== null) return validated;
    }
    return defaultValue;
};

/**
 * Set a value to localStorage
 */
export const setStorageValue = <T>(key: string, value: T): void => {
    if (typeof document === "undefined") return;
    localStorage.setItem(key, String(value));
};

/**
 * Create a typed string validator
 */
export const createStringValidator = <T extends string>(validValues: T[]): ((value: string) => T | null) => {
    return (value: string): T | null => (validValues.includes(value as T) ? (value as T) : null);
};
