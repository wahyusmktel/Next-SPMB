import { v4 as uuidv4, validate as uuidValidate } from "uuid";

/**
 * Generate a new UUID v4
 */
export function generateId(): string {
    return uuidv4();
}

/**
 * Validate UUID format
 */
export function isValidUUID(id: string): boolean {
    return uuidValidate(id);
}

/**
 * Generate a prefixed ID (e.g., "siswa_uuid", "sekolah_uuid")
 */
export function generatePrefixedId(prefix: string): string {
    return `${prefix}_${uuidv4()}`;
}

/**
 * Extract prefix from prefixed ID
 */
export function extractIdPrefix(id: string): string | null {
    const parts = id.split("_");
    if (parts.length < 2) return null;
    return parts[0];
}

/**
 * Generate a short ID (first 8 characters of UUID)
 * Useful for display purposes
 */
export function generateShortId(): string {
    return uuidv4().split("-")[0];
}
