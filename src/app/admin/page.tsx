'use client';

import { useEffect, useState } from 'react';
import {
    Users,
    Building2,
    ClipboardList,
    Settings,
    Search,
    ArrowLeft,
    ExternalLink,
    ShieldAlert,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Business {
    id: string;
    name: string;
    email: string;
    slug: string;
    phone: string | null;
    isPublic: boolean;
    createdAt: string;
    _count: {
        customers: number;
        serviceRequests: number;
    }
}

export default function AdminDashboard() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/admin/businesses')
            .then(res => {
                if (res.status === 401) throw new Error('Bu sayfaya erişim yetkiniz yok.');
                if (!res.ok) throw new Error('İşletmeler yüklenemedi.');
                return res.json();
            })
            .then(data => {
                setBusinesses(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const filtered = businesses.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Sistem Yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-8 text-center">
                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                    <ShieldAlert size={40} />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Erişim Reddedildi</h1>
                <p className="text-slate-500 mb-8 max-w-xs">{error}</p>
                <Link href="/login" className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl">
                    Giriş Yap
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">ServiceFlow <span className="text-blue-600 font-black">Super Admin</span></h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sistem Genel Yönetimi</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toplam İşletme</p>
                            <h2 className="text-2xl font-black text-slate-900">{businesses.length}</h2>
                        </div>
                    </div>
                    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toplam Müşteri</p>
                            <h2 className="text-2xl font-black text-slate-900">{businesses.reduce((acc, b) => acc + b._count.customers, 0)}</h2>
                        </div>
                    </div>
                    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toplam Talep</p>
                            <h2 className="text-2xl font-black text-slate-900">{businesses.reduce((acc, b) => acc + b._count.serviceRequests, 0)}</h2>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-8 relative max-w-md">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="İşletme Adı, E-posta veya URL Ara..."
                        className="w-full h-16 bg-white border border-slate-100 rounded-[2rem] pl-16 pr-6 text-sm font-bold focus:border-blue-600 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* List */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">İşletme Detayları</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Müşteri / Talep</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Kayıt Tarihi</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Durum</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(business => (
                                    <tr key={business.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{business.name}</span>
                                                <span className="text-[11px] text-slate-400 font-bold lowercase tracking-tight">{business.email}</span>
                                                <span className="text-[11px] text-blue-600 font-black uppercase tracking-widest mt-1">/{business.slug}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2 text-slate-900 font-black">
                                                    <Users size={12} className="text-slate-300" />
                                                    {business._count.customers}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                                    <ClipboardList size={12} className="text-slate-300" />
                                                    {business._count.serviceRequests}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-slate-500 font-bold uppercase tracking-widest">
                                            {new Date(business.createdAt).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${business.isPublic
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                    : 'bg-slate-50 text-slate-400 border border-slate-100'
                                                }`}>
                                                {business.isPublic ? 'Aktif Site' : 'Gizli'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={`/t/${business.slug}`}
                                                    target="_blank"
                                                    className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    title="Siteyi Gör"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                                    <Settings size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
