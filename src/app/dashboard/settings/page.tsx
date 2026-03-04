'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Globe, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const settingItems = [
        {
            title: 'Web Sitem (Tanıtım Sayfası)',
            desc: 'Müşterilerinizin gördüğü sayfayı ve marka renklerini düzenleyin.',
            icon: Globe,
            href: '/dashboard/settings/public',
            color: 'bg-blue-50 text-blue-600',
        },
        // We can add more here later like Profile, Security etc.
    ];

    return (
        <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Ayarlar</h1>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60">
                    İşletme ve hesap tercihlerinizi yönetin.
                </p>
            </header>

            <div className="space-y-4">
                {settingItems.map((item, i) => (
                    <Link
                        key={i}
                        href={item.href}
                        className="flex items-center gap-4 p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
                    >
                        <div className={`p-4 ${item.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                            <item.icon size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{item.title}</h3>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-80">{item.desc}</p>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                ))}
            </div>

            <div className="pt-8 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-6 bg-red-50/50 text-red-600 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-red-50 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm text-red-500 group-hover:scale-110 transition-transform">
                            <LogOut size={20} />
                        </div>
                        <span>Oturumu Kapat</span>
                    </div>
                    <ChevronRight size={18} className="opacity-40 group-hover:translate-x-1 transition-all" />
                </button>
            </div>

            <div className="text-center pt-10">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">v1.0.4 Premium</p>
            </div>
        </div>
    );
}
