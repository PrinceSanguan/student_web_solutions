import type { Metadata } from 'next';

import { FlashBanner } from '@/components/admin/flash-banner';
import { PasswordForm, ProfileForm } from '@/components/admin/settings-forms';
import { requireAdmin } from '@/lib/auth/require-admin';
import { flashMessage } from '@/lib/flash';

export const metadata: Metadata = { title: 'Settings' };

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ flash?: string }> }) {
    const [admin, { flash }] = await Promise.all([requireAdmin(), searchParams]);

    return (
        <>
            <FlashBanner message={flashMessage(flash)} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">Manage your profile and password.</p>
            </div>

            <div className="grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
                <ProfileForm name={admin.name} email={admin.email} />
                <PasswordForm />
            </div>
        </>
    );
}
