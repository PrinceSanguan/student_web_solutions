import type { Metadata } from 'next';

import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
    title: 'Admin Login',
    // The login page has no business in search results.
    robots: { index: false, follow: false },
};

/**
 * `proxy.ts` already bounces a signed-in visitor to the dashboard, which is what
 * Laravel's `GuestMiddleware` did, so this page only has to render the form.
 */
export default function LoginPage() {
    return <LoginForm />;
}
