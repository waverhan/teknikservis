'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    User,
    FileText,
    MessageCircle,
    Loader2,
    Check,
    Plus,
    Smartphone,
    Trash2
} from 'lucide-react';

interface Customer {
    id: string;
    name: string;
    phone: string;
}

export default function NewServiceRequestPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingCustomers, setFetchingCustomers] = useState(true);
    const [error, setError] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        deviceBrand: '',
        deviceModel: '',
        description: '',
        notes: '',
        actions: [] as { description: string; price: string | number }[]
    });

    const router = useRouter();

    useEffect(() => {
        fetch('/api/customers')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCustomers(data);
                setFetchingCustomers(false);
            })
            .catch(() => setFetchingCustomers(false));
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomer) {
            setError('Lütfen bir müşteri seçin');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/service-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: selectedCustomer.id,
                    ...formData
                }),
            });

            if (res.ok) {
                router.push('/dashboard/service-requests');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'İş emri oluşturulamadı');
            }
        } catch {
            setError('Bir ağ hatası oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-6 px-4 py-8 max-w-lg mx-auto">
            {/* Header */}
            <header className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 active:scale-95 transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Yeni İş Emri</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Servis kaydını hemen oluşturun</p>
                </div>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
                {/* Customer Selection Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <User size={14} /> Müşteri Seçimi
                    </label>

                    {selectedCustomer ? (
                        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                            <div>
                                <p className="text-sm font-bold text-blue-900">{selectedCustomer.name}</p>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">{selectedCustomer.phone}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedCustomer(null)}
                                className="text-xs font-bold text-blue-600 hover:underline"
                            >
                                Değiştir
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Müşteri ara..."
                                className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                                {fetchingCustomers ? (
                                    <div className="text-center py-4"><Loader2 className="animate-spin mx-auto text-slate-300" size={20} /></div>
                                ) : filteredCustomers.length > 0 ? (
                                    filteredCustomers.map(c => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setSelectedCustomer(c)}
                                            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left"
                                        >
                                            <span className="text-sm font-bold text-slate-700">{c.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400">{c.phone}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-4 space-y-2">
                                        <p className="text-xs text-slate-400 font-bold italic">Müşteri bulunamadı.</p>
                                        <button
                                            type="button"
                                            onClick={() => router.push('/dashboard/customers/new')}
                                            className="text-xs font-bold text-blue-600 uppercase flex items-center justify-center gap-1 mx-auto"
                                        >
                                            <Plus size={14} /> Yeni Müşteri Ekle
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Job Details Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-5">
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

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İş / Arıza Açıklaması</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 text-slate-300" size={18} />
                            <textarea
                                required
                                placeholder="Cihazın arızası nedir? Neler yapılacak?"
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dahili Notlar (Opsiyonel)</label>
                        <div className="relative">
                            <MessageCircle className="absolute left-4 top-4 text-slate-300" size={18} />
                            <textarea
                                placeholder="Sadece sizin göreceğiniz ek notlar..."
                                rows={2}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Yapılan İşlemler Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Check size={14} className="text-blue-500" /> Yapılan İşlemler
                        </label>
                        <button
                            type="button"
                            onClick={() => setFormData({
                                ...formData,
                                actions: [...formData.actions, { description: '', price: '' }]
                            })}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                            + İŞLEM EKLE
                        </button>
                    </div>

                    {formData.actions.length > 0 ? (
                        <div className="space-y-3">
                            {formData.actions.map((action, index) => (
                                <div key={index} className="flex gap-2 animate-in slide-in-from-left-2 duration-300">
                                    <input
                                        type="text"
                                        placeholder="İşlem..."
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
                                        placeholder="TL"
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
                                        className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors shadow-sm"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">Henüz bir işlem eklenmedi</p>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || !selectedCustomer}
                    className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-4"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <Check size={20} />
                            <span>İş Emrini Başlat</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
