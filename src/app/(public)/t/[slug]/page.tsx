import { getTenantBySlug } from "@/lib/tenant";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
import Image from "next/image";
import {
    Phone,
    MapPin,
    MessageCircle,
    ShieldCheck,
    Clock,
    ArrowRight,
    Globe
} from 'lucide-react';
import Link from 'next/link';

interface TenantPageProps {
    params: { slug: string };
}

export default async function TenantPage({ params }: TenantPageProps) {
    const tenant = await getTenantBySlug(params.slug);

    if (!tenant || !tenant.isPublic) {
        notFound();
    }

    const primaryColor = tenant.primaryColor || "#3B82F6";

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-16 pb-12 px-8 overflow-hidden">
                {/* Background Blur */}
                <div
                    className="absolute -top-24 -right-24 w-64 h-64 blur-[120px] rounded-full opacity-20"
                    style={{ backgroundColor: primaryColor }}
                />

                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center p-4 mb-6 shadow-xl shadow-slate-200/50 border border-white">
                        {tenant.logo ? (
                            <Image src={tenant.logo} alt={tenant.name} width={80} height={80} className="object-contain" />
                        ) : (
                            <ShieldCheck size={40} className="text-slate-400" />
                        )}
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight mb-2">
                        {tenant.name}
                    </h1>
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4 flex items-center gap-2">
                        <Globe size={11} /> Yetkili Servis Merkezi
                    </p>

                    <div className="max-w-xs mx-auto mb-10">
                        <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                            &quot;{tenant.publicDescription || 'Sizin için buradayız. Hizmet kalitesinden ödün vermeden güvenilir teknik servis sunmaktayız.'}&quot;
                        </p>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <Link
                            href={`/t/${params.slug}/request`}
                            className="w-full py-5 rounded-[2rem] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/20 bg-tenant"
                        >
                            Hizmet Talebi Oluştur
                            <ArrowRight size={18} />
                        </Link>

                        <a
                            href={`https://wa.me/${tenant.phone}`}
                            className="w-full py-5 rounded-[2rem] bg-emerald-50 text-emerald-600 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 border border-emerald-100 transition-all hover:bg-emerald-100"
                        >
                            <MessageCircle size={20} fill="currentColor" className="text-emerald-50" />
                            WhatsApp ile Ulaşın
                        </a>
                    </div>
                </div>
            </section>

            {/* Info Cards */}
            <section className="px-8 pb-12 grid grid-cols-1 gap-4">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-5 group">
                    <div className="p-4 bg-white rounded-[1.5rem] text-slate-900 shadow-sm shadow-slate-200/50">
                        <Phone size={20} className="text-tenant" />
                    </div>
                    <div className="flex flex-col gap-1 px-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">İletişim Hattı</span>
                        <p className="text-sm font-black text-slate-900 leading-tight tracking-tight uppercase pt-0.5">{tenant.phone || 'Girilmemiş'}</p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-5 group">
                    <div className="p-4 bg-white rounded-[1.5rem] text-slate-900 shadow-sm shadow-slate-200/50">
                        <MapPin size={20} className="text-tenant" />
                    </div>
                    <div className="flex flex-col gap-1 px-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Hizmet Adresi</span>
                        <p className="text-sm font-black text-slate-900 leading-tight tracking-tight uppercase pt-0.5">{tenant.address || 'Girilmemiş'}</p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-5 group">
                    <div className="p-4 bg-white rounded-[1.5rem] text-slate-900 shadow-sm shadow-slate-200/50">
                        <Clock size={20} className="text-tenant" />
                    </div>
                    <div className="flex flex-col gap-1 px-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Çalışma Saatleri</span>
                        <p className="text-sm font-black text-slate-900 leading-tight tracking-tight uppercase pt-0.5">PZT - CMT | 09:00 - 18:00</p>
                    </div>
                </div>
            </section>

            {/* Footer is provided by the layout, but we can add some closing sections here */}
        </div>
    );
}
