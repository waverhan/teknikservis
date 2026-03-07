'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    User,
    FileText,
    MessageCircle,
    Clock,
    PlayCircle,
    CheckCircle2,
    Printer,
    Save,
    CreditCard,
    Loader2,
    Calendar,
    Phone,
    Edit,
    Smartphone
} from 'lucide-react';
import Link from 'next/link';
import PrintReceipt from '@/components/PrintReceipt';

interface IServiceRequest {
    id: string;
    description: string;
    notes: string | null;
    deviceBrand: string | null;
    deviceModel: string | null;
    status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt: string;
    customer: {
        name: string;
        phone: string;
    };
    actions: {
        id: string;
        description: string;
        price: number | string;
    }[];
    receipt: {
        id: string;
        price: number | string;
    } | null;
}

export default function ServiceRequestDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [request, setRequest] = useState<IServiceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [receiptPrice, setReceiptPrice] = useState('');
    const [creatingReceipt, setCreatingReceipt] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetch(`/api/service-requests/${id}`)
                .then(res => res.json())
                .then(data => {
                    setRequest(data);
                    setLoading(false);
                    // Pre-calculate grand total if there are actions
                    if (data.actions && data.actions.length > 0) {
                        const subtotal = data.actions.reduce((acc: number, action: any) => acc + Number(action.price), 0);
                        const grandTotal = subtotal * 1.20;
                        setReceiptPrice(grandTotal.toFixed(2));
                    }
                })
                .catch(() => setLoading(false));
        }
    }, [id]);

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/service-requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                const updated = await res.json();
                setRequest(updated);
            }
        } finally {
            setUpdating(false);
        }
    };

    const handleCreateReceipt = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreatingReceipt(true);
        try {
            const res = await fetch('/api/receipts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceRequestId: id,
                    price: receiptPrice
                }),
            });
            if (res.ok) {
                const receipt = await res.json();
                setRequest(prev => prev ? { ...prev, receipt, status: 'COMPLETED' } : null);
                setShowReceiptModal(false);
            }
        } finally {
            setCreatingReceipt(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Yükleniyor...</p>
            </div>
        );
    }

    if (!request) return <div>İş emri bulunamadı.</div>;

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'NEW': return { label: 'Yeni', icon: <Clock size={14} />, color: 'bg-orange-50 text-orange-600 border-orange-100' };
            case 'IN_PROGRESS': return { label: 'İşlemde', icon: <PlayCircle size={14} />, color: 'bg-blue-50 text-blue-600 border-blue-100' };
            case 'COMPLETED': return { label: 'Tamamlandı', icon: <CheckCircle2 size={14} />, color: 'bg-green-50 text-green-600 border-green-100' };
            default: return { label: status, icon: null, color: 'bg-slate-50 text-slate-600 border-slate-100' };
        }
    };

    const statusInfo = getStatusInfo(request.status);

    return (
        <div className="flex flex-col space-y-6 px-4 py-8 max-w-lg mx-auto pb-24 text-left">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 active:scale-95 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">İş Emri Detayı</h1>
                        <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                        </div>
                    </div>
                </div>
                <Link
                    href={`/dashboard/service-requests/${id}/edit`}
                    className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-blue-600 shadow-sm active:scale-95 transition-all"
                >
                    <Edit size={20} />
                </Link>
            </header>

            {/* Customer Info Card */}
            <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} /> Müşteri Bilgileri
                </h3>
                <div className="space-y-3">
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{request.customer.name}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Phone size={14} className="text-blue-500" />
                        {request.customer.phone}
                    </div>
                </div>
            </section>

            {/* Job Details Card */}
            <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> İş Detayları
                </h3>

                <div className="space-y-4">
                    {(request.deviceBrand || request.deviceModel) && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <Smartphone className="text-blue-500" size={20} />
                            <div>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] leading-none mb-1">Cihaz Bilgisi</p>
                                <p className="text-sm font-black text-blue-900 uppercase tracking-tight">
                                    {request.deviceBrand} {request.deviceModel}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">Arıza / İşlem</p>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{request.description}</p>
                    </div>

                    {request.notes && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                                <MessageCircle size={12} /> Özel Notlar
                            </label>
                            <p className="text-xs font-bold text-slate-400 italic">&quot;{request.notes}&quot;</p>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <Calendar size={12} />
                        Kayıt: {new Date(request.createdAt).toLocaleString('tr-TR')}
                    </div>
                </div>
            </section>

            {/* Actions Performed Section */}
            <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={14} /> Yapılan İşlemler
                </h3>
                <div className="space-y-3">
                    {request.actions && request.actions.length > 0 ? (
                        <>
                            <div className="space-y-2">
                                {request.actions.map((action, idx) => (
                                    <div key={action.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-300">{idx + 1}</span>
                                            <p className="text-xs font-bold text-slate-700">{action.description}</p>
                                        </div>
                                        <p className="text-xs font-black text-slate-900">{Number(action.price).toLocaleString('tr-TR')} TL</p>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ara Toplam</p>
                                    <p className="text-sm font-black text-slate-900">
                                        {request.actions.reduce((acc, a) => acc + Number(a.price), 0).toLocaleString('tr-TR')} TL
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">+ %20 KDV</p>
                                    <p className="text-lg font-black text-blue-600">
                                        {(request.actions.reduce((acc, a) => acc + Number(a.price), 0) * 1.20).toLocaleString('tr-TR')} TL
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-xs font-bold text-slate-400 text-center py-4 italic">İşlem bilgisi girilmemiş.</p>
                    )}
                </div>
            </section>

            {/* Status Update Actions */}
            <section className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200/50 space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Durum Güncelle</h3>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => updateStatus('NEW')}
                        disabled={updating || request.status === 'NEW'}
                        className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${request.status === 'NEW' ? 'bg-orange-600 text-white' : 'bg-white border border-slate-100 text-slate-400 hover:bg-orange-50'}`}
                    >
                        Yeni
                    </button>
                    <button
                        onClick={() => updateStatus('IN_PROGRESS')}
                        disabled={updating || request.status === 'IN_PROGRESS'}
                        className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${request.status === 'IN_PROGRESS' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-400 hover:bg-blue-50'}`}
                    >
                        İşlemde
                    </button>
                    <button
                        onClick={() => updateStatus('COMPLETED')}
                        disabled={updating || request.status === 'COMPLETED'}
                        className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${request.status === 'COMPLETED' ? 'bg-green-600 text-white' : 'bg-white border border-slate-100 text-slate-400 hover:bg-green-50'}`}
                    >
                        Tamamlandı
                    </button>
                </div>
            </section>

            {/* Receipt Action */}
            <div className="fixed bottom-6 left-6 right-6 flex gap-3 max-w-lg mx-auto z-50">
                {request.receipt ? (
                    <button
                        onClick={() => setShowPrintModal(true)}
                        className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Printer size={18} />
                        MAKBUZ YAZDIR
                    </button>
                ) : (
                    <button
                        onClick={() => setShowReceiptModal(true)}
                        className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <CreditCard size={18} />
                        ÖDEME AL / MAKBUZ
                    </button>
                )}
            </div>

            {/* Receipt Creation Modal */}
            {showReceiptModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 animate-in slide-in-from-bottom-8 duration-500">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-2 leading-none">Ödeme Al</h3>
                        <p className="text-xs text-slate-400 font-bold mb-6">İşlemi tamamlamak için tutar girin.</p>

                        <form onSubmit={handleCreateReceipt} className="space-y-6">
                            <div className="space-y-4 text-left">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ödeme Tutarı (KDV Dahil)</label>
                                <div className="space-y-4">
                                    <input
                                        required
                                        autoFocus
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-2xl font-black text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-inner"
                                        value={receiptPrice}
                                        onChange={(e) => setReceiptPrice(e.target.value)}
                                    />

                                    {request.actions && request.actions.length > 0 && (
                                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold text-blue-400">
                                                <span>ARA TOPLAM:</span>
                                                <span>{request.actions.reduce((acc, a) => acc + Number(a.price), 0).toLocaleString('tr-TR')} TL</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold text-blue-400">
                                                <span>KDV (%20):</span>
                                                <span>{(request.actions.reduce((acc, a) => acc + Number(a.price), 0) * 0.20).toLocaleString('tr-TR')} TL</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-black text-blue-600 border-t border-blue-100 pt-2">
                                                <span>HESAPLANAN TOPLAM:</span>
                                                <span>{(request.actions.reduce((acc, a) => acc + Number(a.price), 0) * 1.20).toLocaleString('tr-TR')} TL</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowReceiptModal(false)}
                                    className="flex-1 h-14 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingReceipt}
                                    className="flex-[2] h-14 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {creatingReceipt ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> MAKBUZ OLUŞTUR</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Print Modal */}
            {showPrintModal && request.receipt && (
                <PrintReceipt
                    business={{ name: "Teknik Servis Hub", phone: "Destek Hattı", address: "Servis Merkezi" }}
                    customer={request.customer}
                    serviceRequest={id ? request : { ...request, id: id as string }}
                    receipt={request.receipt}
                    onClose={() => setShowPrintModal(false)}
                />
            )}
        </div>
    );
}

