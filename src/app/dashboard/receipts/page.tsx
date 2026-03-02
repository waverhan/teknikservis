'use client';

import { useEffect, useState } from 'react';
import { ReceiptText, Search, ChevronRight, Printer, QrCode, Smartphone } from 'lucide-react';
import ReceiptQRCode from '@/components/ReceiptQRCode';
import PrintReceipt from '@/components/PrintReceipt';

interface IReceipt {
    id: string;
    price: number | string;
    createdAt: string;
    serviceRequest: {
        id: string;
        description: string;
        createdAt: string;
        customer: {
            name: string;
            phone: string;
            address?: string;
        };
    };
}

export default function ReceiptsPage() {
    const [receipts, setReceipts] = useState<IReceipt[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReceipt, setSelectedReceipt] = useState<IReceipt | null>(null);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);

    useEffect(() => {
        fetch('/api/receipts')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setReceipts(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredReceipts = receipts.filter(r =>
        r.serviceRequest?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col space-y-6 px-4 py-8 max-w-2xl mx-auto">
            {/* Header */}
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Makbuzlar</h1>
                <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-500">
                    <ReceiptText size={20} />
                </div>
            </header>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Müşteri veya Makbuz No Ara..."
                    className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all shadow-sm shadow-slate-100 placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="space-y-3">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-24 bg-white border border-slate-100 rounded-3xl animate-pulse" />
                    ))
                ) : filteredReceipts.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 italic font-medium bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        {searchTerm ? 'Sonuç bulunamadı.' : 'Henüz bir makbuz oluşturulmadı.'}
                    </div>
                ) : (
                    filteredReceipts.map((receipt) => (
                        <div
                            key={receipt.id}
                            className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-blue-200 transition-all flex items-center justify-between group cursor-pointer"
                            onClick={() => { setSelectedReceipt(receipt); setShowPrintModal(true); }}
                        >
                            <div className="flex-1 flex flex-col gap-1 min-w-0 pr-3">
                                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest leading-none">#{receipt.id.substring(0, 8)}</span>
                                <h3 className="text-sm font-black text-slate-900 truncate leading-tight uppercase tracking-tight">{receipt.serviceRequest.customer.name}</h3>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest truncate italic">{receipt.serviceRequest.description}</p>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0 px-3">
                                <span className="text-sm font-black text-slate-900 leading-tight tracking-tighter">{Number(receipt.price).toLocaleString('tr-TR')} TL</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-80">{new Date(receipt.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>

                            <div className="flex gap-1.5 shrink-0 pl-3 border-l border-slate-50">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedReceipt(receipt); setShowPrintModal(true); }}
                                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                                >
                                    <Printer size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedReceipt(receipt); setShowQRModal(true); }}
                                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
                                >
                                    <QrCode size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Web Print Modal (V1) */}
            {showPrintModal && selectedReceipt && (
                <PrintReceipt
                    business={{ name: "ServiceFlow Hizmet", phone: "Destek", address: "Teknik Servis" }}
                    customer={selectedReceipt.serviceRequest.customer}
                    serviceRequest={selectedReceipt.serviceRequest}
                    receipt={selectedReceipt}
                    onClose={() => setShowPrintModal(false)}
                />
            )}

            {/* Flutter QR Modal (V2) */}
            {showQRModal && selectedReceipt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 relative animate-in slide-in-from-bottom-8 duration-500">
                        <header className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    Mobil Yazdır
                                </h3>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5 italic">Flutter Companion App (V2)</p>
                            </div>
                            <button
                                onClick={() => setShowQRModal(false)}
                                className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"
                            >
                                <ChevronRight size={20} className="rotate-90" />
                            </button>
                        </header>

                        <ReceiptQRCode receiptId={selectedReceipt.id} />

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-3 opacity-40 grayscale group hover:grayscale-0 transition-all">
                            <Smartphone size={16} className="text-blue-600" />
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">ServiceFlow iOS/Android Ready</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
