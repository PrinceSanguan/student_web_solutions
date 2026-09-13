/**
 * One-shot success messages.
 *
 * Laravel used `->with('success', …)` in the session and read it back through
 * Inertia's shared props. Server Actions have no session to flash into, so the
 * key travels in the URL (`?flash=created`) and is resolved here. Stateless,
 * survives a refresh, and the banner markup on the pages does not change.
 */
const MESSAGES = {
    created: 'Project created successfully.',
    updated: 'Project updated successfully.',
    deleted: 'Project deleted.',
    'profile-updated': 'Profile updated successfully.',
    'password-updated': 'Password updated successfully.',
} as const;

export type FlashKey = keyof typeof MESSAGES;

/** `null` for a missing or unrecognised key — never echo raw query input. */
export function flashMessage(key: string | string[] | undefined): string | null {
    if (typeof key !== 'string') return null;
    return MESSAGES[key as FlashKey] ?? null;
}
