'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Phone,
    FileText,
    Camera,
    CheckCircle2,
    ChevronLeft,
    ArrowRight,
    Loader2
} from 'lucide-react';
import Link from 'next/link';

interface RequestPageProps {
    params: { slug: string };
}

export default function RequestPage({ params }: RequestPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            description: formData.get('description'),
            preferredDate: formData.get('preferredDate'),
            slug: params.slug,
        };

        try {
            const res = await fetch('/api/public/service-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.error || 'Bir hata oluştu.');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center bg-white animate-in zoom-in duration-500">
                <CheckCircle2 size={100} className="text-emerald-500 mb-8 p-6 bg-emerald-50 rounded-[3rem]" strokeWidth={1} />
                <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Talebiniz Alındı!</h2>
                <p className="text-slate-500 font-medium mb-12 max-w-xs leading-relaxed">
                    Hizmet talebiniz başarıyla teknik ekibimize iletilmiştir. Kısa süre içinde sizinle iletişime geçeceğiz.
                </p>
                <button
                    onClick={() => router.push(`/t/${params.slug}`)}
                    className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                    Ana Sayfaya Dön
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="pt-10 pb-6 px-8 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                <Link href={`/t/${params.slug}`} className="p-3 bg-slate-50 text-slate-900 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100/50">
                    <ChevronLeft size={20} strokeWidth={3} />
                </Link>
                <h1 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] opacity-80">Hizmet Talebi</h1>
                <div className="w-10 h-10" /> {/* Spacer */}
            </header>

            <main className="p-8 flex-1">
                <div className="mb-10 text-center px-4">
                    <h2 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Size Nasıl Yardımcı Olabiliriz?</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Lütfen aşağıdaki formu doldurun</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group transition-all">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Adınız Soyadınız *</label>
                        <div className="relative h-16">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tenant transition-colors" size={20} />
                            <input
                                name="name"
                                required
                                type="text"
                                placeholder="Örn: Ahmet Yılmaz"
                                className="w-full h-full bg-slate-50 border border-slate-100 rounded-[1.5rem] pl-16 pr-6 text-sm font-black text-slate-900 focus:bg-white focus:border-tenant focus:ring-4 focus:ring-tenant/5 outline-none transition-all placeholder:text-slate-200"
                            />
                        </div>
                    </div>

                    <div className="group transition-all">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Telefon Numaranız *</label>
                        <div className="relative h-16">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tenant transition-colors" size={20} />
                            <input
                                name="phone"
                                required
                                type="tel"
                                placeholder="Örn: 05XX XXX XX XX"
                                className="w-full h-full bg-slate-50 border border-slate-100 rounded-[1.5rem] pl-16 pr-6 text-sm font-black text-slate-900 focus:bg-white focus:border-tenant focus:ring-4 focus:ring-tenant/5 outline-none transition-all placeholder:text-slate-200"
                            />
                        </div>
                    </div>

                    <div className="group transition-all">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Arıza / Hizmet Açıklaması *</label>
                        <div className="relative min-h-32">
                            <FileText className="absolute left-6 top-6 text-slate-400 group-focus-within:text-tenant transition-colors" size={20} />
                            <textarea
                                name="description"
                                required
                                placeholder="Cihaz arızasını veya talep ettiğiniz hizmeti kısaca açıklayın..."
                                className="w-full min-h-32 bg-slate-50 border border-slate-100 rounded-[1.5rem] pl-16 pr-6 py-6 text-sm font-black text-slate-900 focus:bg-white focus:border-tenant focus:ring-4 focus:ring-tenant/5 outline-none transition-all placeholder:text-slate-200 resize-none"
                            />
                        </div>
                    </div>

                    <div className="group transition-all opacity-40 pointer-events-none">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Görsel Yükle (Yakında)</label>
                        <div className="w-full py-8 border-2 border-dashed border-slate-100 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 bg-slate-50/30">
                            <Camera size={32} strokeWidth={1} className="text-slate-300" />
                            <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Cihaz Fotoğrafı Ekleyin</span>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-6 rounded-[2rem] bg-tenant text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:grayscale"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                Talebi Tamamla
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}
