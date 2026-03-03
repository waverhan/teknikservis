'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    MapPin,
    Save,
    Loader2,
    Trash2
} from 'lucide-react';

export default function EditCustomerPage() {
    const { id } = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetch(`/api/customers/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setFormData({
                            name: data.name || '',
                            phone: data.phone || '',
                            email: data.email || '',
                            address: data.address || ''
                        });
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setError('Müşteri bilgileri yüklenemedi');
                    setLoading(false);
                });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard/customers');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Müşteri güncellenemedi');
            }
        } catch {
            setError('Bir ağ hatası oluştu');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.push('/dashboard/customers');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Müşteri silinemedi');
            }
        } catch {
            setError('Silme işlemi sırasında bir hata oluştu');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 px-4 py-8 max-w-lg mx-auto">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Müşteri Düzenle</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Müşteri bilgilerini güncelleyin</p>
                    </div>
                </div>

                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    title="Müşteriyi Sil"
                >
                    {deleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                </button>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Müşteri Ad Soyad</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                type="text"
                                placeholder="Örn: Ahmet Yılmaz"
                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefon Numarası</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                type="tel"
                                placeholder="05XX XXX XX XX"
                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Posta (Opsiyonel)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="email"
                                placeholder="ahmet@email.com"
                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adres (Opsiyonel)</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                            <textarea
                                placeholder="Müşteri adresi..."
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full h-16 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-4"
                >
                    {saving ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <Save size={20} />
                            <span>Güncelle ve Kaydet</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
