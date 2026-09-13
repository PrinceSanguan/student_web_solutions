/**
 * Form state shapes shared between the Server Actions and the client forms.
 *
 * These live here rather than beside the actions because a `'use server'` module
 * may only export async functions — a plain object or an interface exported from
 * one is a build error. Keeping them in a neutral module lets both sides import
 * the same definitions.
 *
 * The `errors` maps are keyed exactly like the Laravel validators were, so the
 * ported markup that reads `errors.slug` needs no changes.
 */

/* ── Login ──────────────────────────────────────────────────────────────── */

export interface LoginState {
    errors: { email?: string; password?: string; auth?: string };
    /** Echoed back so a failed submit does not clear the email field. */
    values: { email: string };
}

export const emptyLoginState: LoginState = { errors: {}, values: { email: '' } };

/* ── Capstone create / edit ─────────────────────────────────────────────── */

export interface CapstoneFormValues {
    title: string;
    slug: string;
    description: string;
    price: string;
    category: string;
    technologies: string;
    demo_url: string;
    download_url: string;
    thumbnail: string;
    is_available: boolean;
}

export interface CapstoneFormState {
    errors: Record<string, string>;
    /** Echoed back so a rejected submit keeps what was typed. */
    values: CapstoneFormValues;
}

export const emptyCapstoneValues: CapstoneFormValues = {
    title: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    technologies: '',
    demo_url: '',
    download_url: '',
    thumbnail: '',
    is_available: true,
};

/* ── Admin settings ─────────────────────────────────────────────────────── */

export interface ProfileState {
    errors: { name?: string };
    values: { name: string };
}

export interface PasswordState {
    errors: { current_password?: string; password?: string; password_confirmation?: string };
}

export const emptyPasswordState: PasswordState = { errors: {} };
