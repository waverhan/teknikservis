'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    FileText,
    MessageCircle,
    Save,
    Loader2,
    Trash2,
    Clock,
    PlayCircle,
    CheckCircle2,
    Smartphone
} from 'lucide-react';

export default function EditServiceRequestPage() {
    const { id } = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        description: '',
        notes: '',
        status: '',
        deviceBrand: '',
        deviceModel: '',
        actions: [] as { description: string; price: string | number }[]
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetch(`/api/service-requests/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setFormData({
                            description: data.description || '',
                            notes: data.notes || '',
                            status: data.status || 'NEW',
                            deviceBrand: data.deviceBrand || '',
                            deviceModel: data.deviceModel || '',
                            actions: data.actions || []
                        });
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setError('İş emri bilgileri yüklenemedi');
                    setLoading(false);
                });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/service-requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push(`/dashboard/service-requests/${id}`);
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'İş emri güncellenemedi');
            }
        } catch {
            setError('Bir ağ hatası oluştu');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu iş emrini silmek istediğinize emin misiniz?')) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/service-requests/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.push('/dashboard/service-requests');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'İş emri silinemedi');
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
                <div className="flex items-center gap-4 text-left">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none uppercase">İş Emrini Düzenle</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Servis detaylarını güncelleyin</p>
                    </div>
                </div>

                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                >
                    {deleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                </button>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold animate-shake">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Durum</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { val: 'NEW', label: 'Yeni', icon: Clock, color: 'text-orange-600 bg-orange-50' },
                                { val: 'IN_PROGRESS', label: 'İşlemde', icon: PlayCircle, color: 'text-blue-600 bg-blue-50' },
                                { val: 'COMPLETED', label: 'Bitti', icon: CheckCircle2, color: 'text-green-600 bg-green-50' }
                            ].map((s) => (
                                <button
                                    key={s.val}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: s.val })}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${formData.status === s.val ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-50 text-slate-400 hover:border-slate-200'}`}
                                >
                                    <s.icon size={18} className={formData.status === s.val ? 'text-white' : s.color.split(' ')[0]} />
                                    <span className="text-[10px] font-black uppercase tracking-tight mt-1">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Device Brand & Model */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cihaz Markası</label>
                            <div className="relative">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                <input
                                    type="text"
                                    placeholder="Marka"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 h-12 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                    value={formData.deviceBrand}
                                    onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cihaz Modeli</label>
                            <input
                                type="text"
                                placeholder="Model"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 h-12 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                value={formData.deviceModel}
                                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arıza / İş Açıklaması</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 text-slate-300" size={18} />
                            <textarea
                                required
                                placeholder="Cihaz arızası..."
                                rows={4}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dahili Notlar</label>
                        <div className="relative">
                            <MessageCircle className="absolute left-4 top-4 text-slate-300" size={18} />
                            <textarea
                                placeholder="Özel notlar..."
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Actions Performed */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Yapılan İşlemler</label>
                            <button
                                type="button"
                                onClick={() => setFormData({
                                    ...formData,
                                    actions: [...formData.actions, { description: '', price: '' }]
                                })}
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all"
                            >
                                + İŞLEM EKLE
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.actions.map((action, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="İşlem açıklaması"
                                        className="flex-[2] bg-slate-50 border border-slate-100 rounded-xl px-4 h-12 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                        value={action.description}
                                        onChange={(e) => {
                                            const newActions = [...formData.actions];
                                            newActions[index].description = e.target.value;
                                            setFormData({ ...formData, actions: newActions });
                                        }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Fiyat"
                                        className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 h-12 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                        value={action.price}
                                        onChange={(e) => {
                                            const newActions = [...formData.actions];
                                            newActions[index].price = e.target.value;
                                            setFormData({ ...formData, actions: newActions });
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newActions = formData.actions.filter((_, i) => i !== index);
                                            setFormData({ ...formData, actions: newActions });
                                        }}
                                        className="p-3 text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {formData.actions.length === 0 && (
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    Henüz işlem eklenmedi
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                >
                    {saving ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <Save size={20} />
                            <span>DEĞİŞİKLİKLERİ KAYDET</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

