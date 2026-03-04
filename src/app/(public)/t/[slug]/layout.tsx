import { getTenantBySlug } from "@/lib/tenant";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
import { Metadata } from "next";

interface TenantLayoutProps {
    children: React.ReactNode;
    params: { slug: string };
}

export async function generateMetadata({ params }: TenantLayoutProps): Promise<Metadata> {
    const tenant = await getTenantBySlug(params.slug);
    if (!tenant) return { title: "Teknik Servis" };

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://teknikservis.info';
    const tenantUrl = `${appUrl}/t/${tenant.slug}`;

    return {
        title: `${tenant.name} | Teknik Servis`,
        description: tenant.publicDescription || `${tenant.name} teknik servis hizmetleri.`,
        alternates: {
            canonical: tenantUrl,
        },
        openGraph: {
            title: `${tenant.name} | Teknik Servis`,
            description: tenant.publicDescription || `${tenant.name} teknik servis hizmetleri.`,
            url: tenantUrl,
            siteName: 'Teknik Servis',
            locale: 'tr_TR',
            type: 'website',
        }
    };
}

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
    const tenant = await getTenantBySlug(params.slug);

    if (!tenant || !tenant.isPublic) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="min-h-screen">
                {children}
            </main>
        </div>
    );
}
