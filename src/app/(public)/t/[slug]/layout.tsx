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
    if (!tenant) return { title: "ServiceFlow" };

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://serviceflow.com';
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
            siteName: 'ServiceFlow',
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
        <div className="min-h-screen bg-slate-50" style={{ '--tenant-primary': tenant.primaryColor || '#3B82F6' } as React.CSSProperties}>
            {/* Dynamic Theme Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .text-tenant { color: var(--tenant-primary); }
        .bg-tenant { background-color: var(--tenant-primary); }
        .border-tenant { border-color: var(--tenant-primary); }
        .ring-tenant { --tw-ring-color: var(--tenant-primary); }
      `}} />

            <main className="mx-auto max-w-lg bg-white min-h-screen shadow-2xl relative overflow-hidden">
                {children}

                {/* Simple Footer */}
                <footer className="p-8 text-center border-t border-slate-50 mt-12 bg-slate-50/50">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-loose">
                        Powered by <span className="text-slate-900">ServiceFlow</span>
                    </p>
                </footer>
            </main>
        </div>
    );
}
