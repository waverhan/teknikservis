'use client';

import { useEffect, useState } from 'react';
import {
    Globe,
    Palette,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    Info
} from 'lucide-react';

interface IBusiness {
    slug: string;
    isPublic: boolean;
    primaryColor: string;
    publicDescription: string;
}

export default function PublicSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [business, setBusiness] = useState<IBusiness | null>(null);

    const colors = [
        { name: 'Blue', value: '#3B82F6' },
        { name: 'Red', value: '#EF4444' },
        { name: 'Green', value: '#10B981' },
        { name: 'Purple', value: '#8B5CF6' },
        { name: 'Indigo', value: '#6366F1' },
        { name: 'Orange', value: '#F59E0B' },
        { name: 'Pink', value: '#EC4899' },
        { name: 'Slate', value: '#334155' },
    ];

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                setBusiness(data.business);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const data = {
            primaryColor: formData.get('primaryColor'),
            publicDescription: formData.get('publicDescription'),
            isPublic: formData.get('isPublic') === 'on',
            slug: formData.get('slug'), // Read-only in UI, but sent just in case or for validation
        };

        try {
            const res = await fetch('/api/business/settings/public', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Güncelleme başarısız oldu.');

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Güncelleme sırasında bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
        );
    }

    if (!business) return null;

    return (
        <div className="flex flex-col space-y-8 px-6 py-10 max-w-2xl mx-auto">
            {/* Header */}
            <header className="flex flex-col gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Globe size={24} className="text-blue-600" />
                    Web Sitem (Tanıtım Sayfam)
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                    Müşterilerinizin sizinle iletişime geçebileceği ve talep oluşturabileceği sayfayı düzenleyin.
                </p>
            </header>

            {/* Preview Link Card */}
            <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-slate-200 group overflow-hidden relative">
                {/* Background Highlight */}
                <div
                    className="absolute -right-8 -top-8 w-32 h-32 blur-[40px] rounded-full opacity-40 group-hover:opacity-60 transition-all duration-700"
                    style={{ backgroundColor: business.primaryColor || '#3B82F6' }}
                />

                <div className="flex flex-col gap-1 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Canlı Site Adresiniz</span>
                    <p className="text-sm font-black tracking-tight">{business.slug}.serviceflow.com</p>
                </div>
                <a
                    href={`/b/${business.slug}`}
                    target="_blank"
                    className="p-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl transition-all relative z-10"
                >
                    <ExternalLink size={20} />
                </a>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Public Toggle */}
                <section className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><Globe size={20} /></div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Halka Açık Sayfa</h3>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Siteniz internete açık mı?</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="isPublic" className="sr-only peer" defaultChecked={business.isPublic} />
                        <div className="w-14 h-8 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </section>

                {/* Branding */}
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 mb-2 px-1">
                        <Palette size={20} className="text-slate-400" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.1em]">Görünüm ve Renk Paleti</h3>
                    </div>

                    {/* Color Presets */}
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                        {colors.map((color) => (
                            <label key={color.value} className="relative cursor-pointer group">
                                <input type="radio" name="primaryColor" value={color.value} className="sr-only peer" defaultChecked={business.primaryColor === color.value} />
                                <div
                                    className="w-10 h-10 rounded-2xl border-2 border-transparent peer-checked:border-slate-900 peer-checked:scale-110 transition-all shadow-sm shadow-slate-200"
                                    style={{ backgroundColor: color.value }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 text-white">
                                    <CheckCircle2 size={16} fill="rgba(0,0,0,0.1)" />
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* Custom Description */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Kısa Tanıtım Yazısı</label>
                        <textarea
                            name="publicDescription"
                            defaultValue={business.publicDescription}
                            className="w-full min-h-32 bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-black text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all placeholder:text-slate-300"
                            placeholder="Müşterilerinize sunduğunuz hizmetleri kısaca bu alanda anlatın..."
                        />
                        <div className="flex items-center gap-2 px-1 opacity-60">
                            <Info size={12} className="text-slate-400" />
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Bu yazı sitenizin ana sayfasında hero alanında görünecektir.</p>
                        </div>
                    </div>
                </section>

                {/* Read-only Slug */}
                <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between opacity-70 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white text-slate-300 rounded-2xl shadow-sm"><Info size={20} /></div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Kullanıcı Adı (Slug)</h3>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{business.slug}</p>
                        </div>
                    </div>
                    <input type="hidden" name="slug" value={business.slug} />
                    <div className="px-3 py-2 bg-slate-200 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">Kayıtlı</div>
                </section>

                {/* Feedback & Actions */}
                <div className="sticky bottom-6 flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center gap-3 border border-red-100 shadow-lg shadow-red-500/5">
                            <AlertCircle size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center gap-3 border border-emerald-100 shadow-lg shadow-emerald-500/5">
                            <CheckCircle2 size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Ayarlar Başarıyla Kaydedildi!</span>
                        </div>
                    )}

                    <button
                        disabled={saving}
                        type="submit"
                        className="w-full py-6 rounded-[2rem] bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all hover:bg-black active:scale-[0.98] shadow-2xl shadow-slate-900/10 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : (
                            <>
                                <Save size={20} />
                                Değişiklikleri Kaydet
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
