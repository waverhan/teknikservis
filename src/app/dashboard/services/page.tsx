'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Wrench } from 'lucide-react';

interface Service {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/business/services');
            const data = await res.json();
            if (Array.isArray(data)) {
                setServices(data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const url = editingService
            ? `/api/business/services/${editingService.id}`
            : '/api/business/services';
        const method = editingService ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                fetchServices();
                closeModal();
            }
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/business/services/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setServices(services.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const openModal = (service: Service | null = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                description: service.description || '',
                price: service.price?.toString() || '',
            });
        } else {
            setEditingService(null);
            setFormData({ name: '', description: '', price: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setFormData({ name: '', description: '', price: '' });
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 space-y-8">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Hizmetlerim</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Verdiğiniz servisleri listeleyin</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={24} />
                </button>
            </header>

            <div className="grid gap-4">
                {services.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <Wrench className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Henüz bir hizmet eklemediniz</p>
                    </div>
                ) : (
                    services.map((service) => (
                        <div
                            key={service.id}
                            className="group p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all flex items-center justify-between"
                        >
                            <div className="flex-1 space-y-1">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{service.name}</h3>
                                {service.description && (
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{service.description}</p>
                                )}
                                {service.price && (
                                    <p className="text-xs font-black text-blue-600 mt-2">₺{Number(service.price).toFixed(2)}</p>
                                )}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => openModal(service)}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-[3rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic mb-6">
                            {editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Hizmet Adı</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    placeholder="Örn: Ekran Değişimi"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Açıklama (Opsiyonel)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    placeholder="Hizmet detaylarını yazın..."
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Fiyat (₺, Opsiyonel)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
