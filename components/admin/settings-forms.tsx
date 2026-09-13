'use client';

import { useActionState } from 'react';

import { updatePasswordAction, updateProfileAction } from '@/app/admin/settings/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { emptyPasswordState } from '@/lib/forms';

/**
 * The two settings forms, styled to match the admin capstone pages.
 *
 * New markup: `Admin\SettingsController` shipped without a view in the Laravel app
 * (the route 500'd), so there was nothing to port. The fields are exactly the ones
 * the controller validated — name, current_password, password, password_confirmation.
 */

export function ProfileForm({ name, email }: { name: string; email: string }) {
    const [state, formAction, isPending] = useActionState(updateProfileAction, { errors: {}, values: { name } });

    return (
        <form action={formAction} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
            <div>
                <h2 className="font-semibold text-gray-800">Profile</h2>
                <p className="text-xs text-gray-500">Your display name in the admin sidebar and header.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" defaultValue={state.values.name} autoComplete="name" />
                {state.errors.name && <p className="text-xs text-red-500">{state.errors.name}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled readOnly />
                <p className="text-xs text-gray-400">
                    The sign-in email is set outside the app. To change it, run{' '}
                    <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px]">npm run set-admin-password</code>.
                </p>
            </div>

            <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : 'Save Profile'}
            </Button>
        </form>
    );
}

export function PasswordForm() {
    const [state, formAction, isPending] = useActionState(updatePasswordAction, emptyPasswordState);

    return (
        <form action={formAction} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
            <div>
                <h2 className="font-semibold text-gray-800">Password</h2>
                <p className="text-xs text-gray-500">Use at least 8 characters.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="current_password">Current password</Label>
                <Input id="current_password" name="current_password" type="password" autoComplete="current-password" />
                {state.errors.current_password && <p className="text-xs text-red-500">{state.errors.current_password}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input id="password" name="password" type="password" autoComplete="new-password" />
                {state.errors.password && <p className="text-xs text-red-500">{state.errors.password}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm new password</Label>
                <Input id="password_confirmation" name="password_confirmation" type="password" autoComplete="new-password" />
                {state.errors.password_confirmation && <p className="text-xs text-red-500">{state.errors.password_confirmation}</p>}
            </div>

            <Button type="submit" disabled={isPending}>
                {isPending ? 'Updating…' : 'Update Password'}
            </Button>
        </form>
    );
}
