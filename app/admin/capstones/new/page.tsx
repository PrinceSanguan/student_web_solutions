import type { Metadata } from 'next';
import Link from 'next/link';

import { CapstoneForm } from '@/components/admin/capstones/capstone-form';
import { routes } from '@/lib/routes';
import { createCapstone } from '../actions';

export const metadata: Metadata = { title: 'New Project' };

/** Ported from `pages/Admin/Capstones/Create.tsx`. */
export default function NewCapstonePage() {
    return (
        <>
            <div className="mb-6 flex items-center gap-3">
                <Link href={routes.admin.capstones.index} className="text-sm text-gray-500 hover:text-gray-700">
                    ← Projects
                </Link>
                <span className="text-gray-300">/</span>
                <h1 className="text-xl font-bold text-gray-900">New Project</h1>
            </div>

            <CapstoneForm mode="create" action={createCapstone} />
        </>
    );
}
