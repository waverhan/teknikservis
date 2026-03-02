'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface PublicRequestFormProps {
    slug: string;
}

export default function PublicRequestForm({ slug }: PublicRequestFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        description: '',
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/public/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, slug }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('Talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.');
            } else {
                setStatus('error');
                setMessage(data.error || 'Talep gönderilirken bir hata oluştu.');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="p-4 bg-green-50 text-green-600 rounded-full">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Harika! Talebiniz Alındı</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs">{message}</p>
                <button
                    onClick={() => {
                        setFormData({ name: '', phone: '', email: '', address: '', description: '' });
                        setStatus('idle');
                    }}
                    className="mt-6 text-sm font-bold text-blue-600 hover:underline"
                >
                    Yeni Başvuru Yap
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Ad Soyad *</label>
                <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Adınızı ve soyadınızı girin"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all outline-none"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Telefon *</label>
                <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="05XX XXX XX XX"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all outline-none"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Adres</label>
                <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Cihazın teslim alınacağı adres"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all outline-none"
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Arıza Açıklaması *</label>
                <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Cihazdaki sorunu kısaca açıklayın"
                    className="w-full rounded-3xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all outline-none resize-none"
                />
            </div>

            {status === 'error' && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold animate-shake">
                    <AlertCircle size={16} />
                    <span>{message}</span>
                </div>
            )}

            <button
                disabled={status === 'loading'}
                className="w-full btn-primary disabled:opacity-50 mt-4 flex items-center justify-center gap-3 h-16 text-base font-black uppercase tracking-widest shadow-xl shadow-blue-100"
            >
                {status === 'loading' ? 'Gönderiliyor...' : (
                    <>
                        <span>BAŞVURUYU GÖNDER</span>
                        <Send size={18} />
                    </>
                )}
            </button>
        </form>
    );
}
