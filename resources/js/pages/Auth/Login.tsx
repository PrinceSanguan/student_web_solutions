import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import { route } from 'ziggy-js';

interface LoginProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Login({ flash }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const [authError, setAuthError] = useState<string | null>(null);
    const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error' | null; message: string | null }>({
        type: null,
        message: null,
    });

    useEffect(() => {
        if (flash?.success) {
            setFlashMessage({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setFlashMessage({ type: 'error', message: flash.error });
        } else {
            setFlashMessage({ type: null, message: null });
        }
    }, [flash]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        setFlashMessage({ type: null, message: null });

        post(route('auth.login.store'), {
            onError: (errs) => {
                if (errs.auth) setAuthError(errs.auth);
            },
        });
    };

    return (
        <>
            <Head title="Admin Login | Student Web Solutions" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
                <Card className="w-full max-w-sm rounded-2xl shadow-xl">
                    <CardContent className="p-8">
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
                            <p className="mt-1 text-sm text-gray-500">Student Web Solutions</p>
                        </div>

                        {flashMessage.message && (
                            <Alert variant={flashMessage.type === 'error' ? 'destructive' : 'default'} className="mb-4">
                                <AlertDescription>{flashMessage.message}</AlertDescription>
                            </Alert>
                        )}

                        {authError && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{authError}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@gmail.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="email"
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <Button type="submit" className="mt-2 w-full" disabled={processing}>
                                {processing ? 'Signing in…' : 'Sign In'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
