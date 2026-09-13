'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { hashPassword, passwordError, verifyPassword } from '@/lib/auth/password';
import { requireAdmin } from '@/lib/auth/require-admin';
import type { PasswordState, ProfileState } from '@/lib/forms';
import { routes } from '@/lib/routes';
import { getStoredAdmin, updateAdminPassword, updateAdminProfile } from '@/lib/store/admin';

/**
 * Ports `Admin\SettingsController::updateProfile` and `::updatePassword`.
 *
 * The controller existed in the Laravel app but its page component
 * (`Inertia::render('Admin/Settings')`) did not, so `/admin/settings` returned a
 * 500 while the admin header linked straight to it. The logic here is the
 * controller's, unchanged; only the missing view is new.
 */

export async function updateProfileAction(_previous: ProfileState, formData: FormData): Promise<ProfileState> {
    await requireAdmin();

    const name = String(formData.get('name') ?? '').trim();

    if (!name) return { errors: { name: 'The name field is required.' }, values: { name } };
    if (name.length > 255) return { errors: { name: 'The name may not be greater than 255 characters.' }, values: { name } };

    await updateAdminProfile(name);

    // The sidebar and header read the name from the layout, so the whole admin
    // subtree has to re-render for the change to show.
    revalidatePath('/admin', 'layout');
    redirect(`${routes.admin.settings}?flash=profile-updated`);
}

export async function updatePasswordAction(_previous: PasswordState, formData: FormData): Promise<PasswordState> {
    await requireAdmin();

    const currentPassword = String(formData.get('current_password') ?? '');
    const password = String(formData.get('password') ?? '');
    const confirmation = String(formData.get('password_confirmation') ?? '');

    if (!currentPassword) return { errors: { current_password: 'The current password field is required.' } };

    const lengthError = passwordError(password);
    if (lengthError) return { errors: { password: lengthError } };
    if (password !== confirmation) return { errors: { password_confirmation: 'The password confirmation does not match.' } };

    const admin = await getStoredAdmin();
    if (!admin) return { errors: { current_password: 'No admin account exists.' } };

    if (!(await verifyPassword(currentPassword, admin.passwordHash))) {
        return { errors: { current_password: 'The provided password does not match your current password.' } };
    }

    await updateAdminPassword(await hashPassword(password));

    // The session cookie is signed with a server secret, not derived from the
    // password, so it stays valid — the same as Laravel's behaviour here.
    redirect(`${routes.admin.settings}?flash=password-updated`);
}
