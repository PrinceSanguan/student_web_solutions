import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CapstoneForm } from '@/components/admin/capstones/capstone-form';
import type { CapstoneFormValues } from '@/lib/forms';
import { routes } from '@/lib/routes';
import { findById } from '@/lib/store/capstones';
import { updateCapstone } from '../../actions';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const capstone = await findById(Number((await params).id));
    return { title: capstone ? `Edit ${capstone.title}` : 'Edit Project' };
}

/** Ported from `pages/Admin/Capstones/Edit.tsx`. */
export default async function EditCapstonePage({ params }: Props) {
    const id = Number((await params).id);
    if (!Number.isInteger(id)) notFound();

    const capstone = await findById(id);
    if (!capstone) notFound();

    // The form works in strings, the record in typed columns. Same flattening the
    // Laravel controller did when it built the Inertia props.
    const initialValues: CapstoneFormValues = {
        title: capstone.title,
        slug: capstone.slug,
        description: capstone.description,
        price: String(capstone.price),
        category: capstone.category ?? '',
        technologies: capstone.technologies?.join(', ') ?? '',
        demo_url: capstone.demo_url ?? '',
        download_url: capstone.download_url ?? '',
        thumbnail: capstone.thumbnail ?? '',
        is_available: capstone.is_available,
    };

    return (
        <>
            <div className="mb-6 flex items-center gap-3">
                <Link href={routes.admin.capstones.index} className="text-sm text-gray-500 hover:text-gray-700">
                    ← Projects
                </Link>
                <span className="text-gray-300">/</span>
                <h1 className="text-xl font-bold text-gray-900">Edit Project</h1>
            </div>

            <CapstoneForm
                mode="edit"
                // `bind` turns the three-argument action into the two-argument shape
                // `useActionState` expects, with the id fixed on the server side so a
                // client cannot swap it for someone else's record.
                action={updateCapstone.bind(null, capstone.id)}
                initialValues={initialValues}
                hasStoredFile={Boolean(capstone.download_file)}
            />
        </>
    );
}
