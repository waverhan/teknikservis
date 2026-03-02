import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Plus, Users, ClipboardList, Wallet, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const [business, counts] = await Promise.all([
        prisma.business.findUnique({ where: { id: session.businessId } }),
        Promise.all([
            prisma.customer.count({ where: { businessId: session.businessId } }),
            prisma.serviceRequest.count({ where: { businessId: session.businessId, status: 'IN_PROGRESS' } }),
            prisma.serviceRequest.count({ where: { businessId: session.businessId, status: 'NEW' } }),
        ])
    ]);

    const [customerCount, inProgressCount, newJobCount] = counts;

    return (
        <div className="flex flex-col space-y-6 px-4 py-8">
            {/* Header */}
            <header className="flex items-center justify-between pb-2">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                        Selam, {business?.name} 👋
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Bu hafta neler yapıyoruz?</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                    {business?.logo ? <img src={business.logo} alt="logo" /> : <div className="text-slate-400 font-bold">SF</div>}
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-100 flex flex-col justify-between h-32">
                    <ClipboardList size={22} className="opacity-80" />
                    <div>
                        <span className="text-2xl font-bold leading-none">{inProgressCount + newJobCount}</span>
                        <p className="text-xs font-medium opacity-80 mt-1 uppercase tracking-wider">Aktif İşler</p>
                    </div>
                </div>
                <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 text-slate-900 flex flex-col justify-between h-32">
                    <Users size={22} className="text-blue-600" />
                    <div>
                        <span className="text-2xl font-bold leading-none">{customerCount}</span>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Müşteriler</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <section>
                <h2 className="text-sm font-bold text-slate-800 mb-3 ml-1">Hızlı İşlemler</h2>
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-200 transition-colors text-left group">
                        <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
                            <Plus size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 leading-tight">İş <br />Emri</p>
                        </div>
                    </button>
                    <button className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-200 transition-colors text-left group">
                        <div className="p-2.5 rounded-xl bg-green-50 text-green-600 group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 leading-tight">Müşteri <br />Kaydı</p>
                        </div>
                    </button>
                </div>
            </section>

            {/* Activity placeholders */}
            <section className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-800 ml-1">Son İş Emirleri</h2>
                    <Link href="/dashboard/service-requests" className="text-xs font-bold text-blue-600 flex items-center gap-1">
                        Tümünü Gör <ArrowUpRight size={14} />
                    </Link>
                </div>

                <div className="space-y-3">
                    {/* Minimal empty state visually appealing */}
                    <div className="flex flex-col items-center justify-center p-8 bg-white/50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-xs text-slate-400 font-medium italic">Henüz aktif bir iş emri bulunmuyor.</p>
                    </div>
                </div>
            </section>

            {/* Public Link Card */}
            <section className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-100 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-base mb-1">Müşteri Başvuru Sayfası</h3>
                    <p className="text-xs opacity-90 leading-relaxed mb-4">Müşterilerinize bu adresi göndererek iş emirlerini doğrudan sisteminize girmelerini sağlayın.</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.2 px-3 text-[10px] font-mono select-all truncate">
                        {`${process.env.NEXT_PUBLIC_APP_URL}/b/${business?.slug}`}
                    </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <ArrowUpRight size={100} />
                </div>
            </section>

        </div>
    );
}
