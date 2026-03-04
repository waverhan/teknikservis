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
    Info,
    Image as ImageIcon,
    Phone,
    MapPin,
    Map as MapIcon,
    ArrowRight
} from 'lucide-react';

interface IBusiness {
    slug: string;
    isPublic: boolean;
    primaryColor: string;
    publicDescription: string;
    logo?: string;
    coverImage?: string;
    phone?: string;
    address?: string;
    googleMapsUrl?: string;
    name: string;
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
            logo: formData.get('logo'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            googleMapsUrl: formData.get('googleMapsUrl'),
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
        <div className="flex flex-col space-y-8 px-6 py-10 max-w-2xl mx-auto pb-32">
            {/* Header */}
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic">
                    <Globe size={32} className="text-blue-600" />
                    SİTE EDİTÖRÜ
                </h1>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest opacity-60">
                    Müşterilerinizin gördüğü tanıtım sayfasını buradan yönetin.
                </p>
            </header>

            {/* Live Preview Bar */}
            <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl shadow-blue-900/10 group overflow-hidden relative border border-white/5">
                <div
                    className="absolute -right-8 -top-8 w-48 h-48 blur-[60px] rounded-full opacity-30 group-hover:opacity-50 transition-all duration-1000"
                    style={{ backgroundColor: business.primaryColor || '#3B82F6' }}
                />

                <div className="flex flex-col gap-1 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Canlı Yayın Adresi</span>
                    <p className="text-lg font-black tracking-tight italic flex items-center gap-2">
                        {business.slug}.teknikservis.info
                        <button
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(`https://${business.slug}.teknikservis.info`);
                                alert('Link kopyalandı!');
                            }}
                            className="p-1 px-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-blue-300 text-[8px] font-black"
                        >
                            KOPYALA
                        </button>
                    </p>
                </div>
                <a
                    href={`https://${business.slug}.teknikservis.info`}
                    target="_blank"
                    className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all relative z-10 shadow-lg"
                >
                    <span>SİTEYİ AÇ</span>
                    <ExternalLink size={16} />
                </a>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Visual Branding Section */}
                <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                        <Palette size={20} className="text-blue-600" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Marka ve Görünüm</h3>
                    </div>

                    {/* Logo URL */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Logo URL (PNG/SVG)</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                name="logo"
                                defaultValue={business.logo}
                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                placeholder="https://isletme.com/logo.png"
                            />
                        </div>
                    </div>

                    {/* Color Presets */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Ana Tema Rengi</label>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                            {colors.map((color) => (
                                <label key={color.value} className="relative cursor-pointer group">
                                    <input type="radio" name="primaryColor" value={color.value} className="sr-only peer" defaultChecked={business.primaryColor === color.value} />
                                    <div
                                        className="w-10 h-10 rounded-2xl border-2 border-transparent peer-checked:border-slate-900 peer-checked:scale-110 transition-all shadow-sm"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 text-white">
                                        <CheckCircle2 size={16} />
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                        <Info size={20} className="text-blue-600" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">SİTE İÇERİĞİ</h3>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Tanıtım Yazısı (Hero)</label>
                        <textarea
                            name="publicDescription"
                            defaultValue={business.publicDescription}
                            className="w-full min-h-32 bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                            placeholder="Müşterilerinizi karşılayacak etkileyici bir giriş cümlesi yazın..."
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Phone */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">İşletme Telefonu</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    name="phone"
                                    defaultValue={business.phone}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="0212 XXX XX XX"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">İşletme Adresi (Metin)</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                                <textarea
                                    name="address"
                                    defaultValue={business.address}
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="Müşterilerinizin sizi bulabileceği tam adres..."
                                />
                            </div>
                        </div>

                        {/* Maps URL */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Google Haritalar Konum Linki</label>
                            <div className="relative">
                                <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    name="googleMapsUrl"
                                    defaultValue={business.googleMapsUrl}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Status Section */}
                <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-xl shadow-slate-200/40">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner"><Globe size={20} /></div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">SİTE YAYIN DURUMU</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Siteniz internete açık mı?</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="isPublic" className="sr-only peer" defaultChecked={business.isPublic} />
                        <div className="w-16 h-9 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                    </label>
                </section>

                {/* Fixed Save Button Container */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
                    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {error && (
                            <div className="p-4 bg-red-600 text-white rounded-2xl flex items-center gap-3 shadow-2xl animate-shake">
                                <AlertCircle size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center gap-3 shadow-2xl animate-bounce">
                                <CheckCircle2 size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Değişiklikler Canlıya Alındı!</span>
                            </div>
                        )}

                        <button
                            disabled={saving}
                            type="submit"
                            className="w-full h-20 rounded-[2rem] bg-slate-900 text-white font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all hover:bg-black active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)] disabled:opacity-50 group italic"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <Save size={20} className="group-hover:scale-125 transition-all" />
                                    <span>GÜNCELLEMELERİ YAYINLA</span>
                                    <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}
