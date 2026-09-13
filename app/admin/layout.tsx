import type { Metadata } from 'next';

import { Header } from '@/components/admin/header';
import { Sidebar } from '@/components/admin/sidebar';
import { requireAdmin } from '@/lib/auth/require-admin';

export const metadata: Metadata = {
    title: { default: 'Admin', template: '%s | Admin' },
    robots: { index: false, follow: false },
};

/**
 * The admin shell.
 *
 * Every Laravel admin page rendered `<Sidebar>` and `<Header>` itself and each one
 * sourced the user differently (a page prop in `Admin/Dashboard`, `usePage().props.auth`
 * in the capstone pages). A layout does it once, and `requireAdmin()` here is the
 * gate — `proxy.ts` only does the fast redirect.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const admin = await requireAdmin();

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar user={admin} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header user={admin} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
