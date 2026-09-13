'use client';

import { useActionState } from 'react';

import { loginAction } from '@/app/login/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { emptyLoginState } from '@/lib/forms';

/**
 * Ported from `pages/Auth/Login.tsx`.
 *
 * Inertia's `useForm` became `useActionState`: the action returns the errors and
 * the echoed email, and `isPending` replaces `processing`. The inputs are
 * uncontrolled now — `name` attributes feed the FormData — so there is no state
 * to keep in sync, and `defaultValue` restores the email after a failed attempt.
 */
export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, emptyLoginState);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <Card className="w-full max-w-sm rounded-2xl shadow-xl">
                <CardContent className="p-8">
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
                        <p className="mt-1 text-sm text-gray-500">Student Web Solutions</p>
                    </div>

                    {state.errors.auth && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{state.errors.auth}</AlertDescription>
                        </Alert>
                    )}

                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@gmail.com"
                                defaultValue={state.values.email}
                                autoComplete="email"
                            />
                            {state.errors.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
                            {state.errors.password && <p className="text-sm text-red-500">{state.errors.password}</p>}
                        </div>

                        <Button type="submit" className="mt-2 w-full" disabled={isPending}>
                            {isPending ? 'Signing in…' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
