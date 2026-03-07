'use client';

import { useState } from 'react';
import { bluetoothPrinter, BluetoothService } from '@/lib/bluetooth-service';
import { Printer, Bluetooth, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface PrintReceiptProps {
    business: {
        name: string;
        phone?: string | null;
        address?: string | null;
        slug: string;
    };
    customer: {
        name: string;
        phone: string;
    };
    serviceRequest: {
        id: string;
        description: string;
        createdAt: Date | string;
        actions?: { description: string; price: number | string }[];
    };
    receipt: {
        price: number | string;
    };
    onClose?: () => void;
}

export default function PrintReceipt({ business, customer, serviceRequest, receipt, onClose }: PrintReceiptProps) {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'printing' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleConnect = async () => {
        setStatus('connecting');
        setErrorMsg('');
        const success = await bluetoothPrinter.connect();
        if (success) {
            setStatus('connected');
        } else {
            setStatus('error');
            setErrorMsg('Yazıcıya bağlanılamadı. Bluetooth açık mı?');
        }
    };

    const handlePrint = async () => {
        setStatus('printing');
        try {
            const dateStr = new Date(serviceRequest.createdAt).toLocaleDateString('tr-TR');

            const total = serviceRequest.actions && serviceRequest.actions.length > 0
                ? serviceRequest.actions.reduce((acc, a) => acc + Number(a.price), 0)
                : Number(receipt.price);
            const subtotal = total / 1.20;
            const kdv = total - subtotal;

            const actionDetails = (serviceRequest.actions || []).map((a, i) => ({
                label: `${i + 1}-${a.description}`,
                value: `${Number(a.price).toLocaleString('tr-TR')} TL`
            }));

            const publicUrl = `teknikservis.com/t/${business.slug}`;

            const jobData = BluetoothService.prepareReceiptJob({
                title: business.name,
                details: [
                    { label: 'Tarih', value: dateStr },
                    { label: 'Müşteri', value: customer.name },
                    { label: 'Telefon', value: customer.phone },
                    { label: '-', value: '-' },
                    ...actionDetails,
                    { label: '-', value: '-' },
                    { label: 'MATRAH', value: `${subtotal.toLocaleString('tr-TR')} TL` },
                    { label: 'KDV DAHIL', value: `${kdv.toLocaleString('tr-TR')} TL` },
                ],
                totalTitle: 'GENEL TOPLAM',
                totalValue: `${total.toLocaleString('tr-TR')} TL`,
                footer: `${business.address || ''}\nTel: ${business.phone || ''}\n${publicUrl}\n\nTesekkur ederiz!`
            });

            await bluetoothPrinter.print(jobData);
            setStatus('success');
            setTimeout(() => setStatus('connected'), 3000); // Reset to connected after success
        } catch (err) {
            console.error(err);
            setStatus('error');
            setErrorMsg('Yazdırma sırasında bir hata oluştu.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Makbuz Yazdır</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Preview Area */}
                <div className="p-6 bg-slate-50">
                    <div className="bg-white border border-slate-200 shadow-sm p-5 font-mono text-[10px] leading-relaxed relative overflow-hidden">
                        {/* Decorative receipt edges */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[radial-gradient(circle,transparent_20%,white_20%)] bg-[length:8px_8px] bg-repeat-x -mt-0.5"></div>

                        <div className="text-center mb-4">
                            <p className="font-black text-[10px] uppercase mb-1 leading-tight">{business.name}</p>
                            {business.address && <p className="opacity-60 text-[7px]">{business.address}</p>}
                            {business.phone && <p className="opacity-60 text-[7px]">Tel: {business.phone}</p>}
                            <p className="text-blue-600 text-[7px] font-bold mt-1">teknikservis.com/t/{business.slug}</p>
                        </div>

                        <div className="space-y-1 mb-4">
                            <div className="flex justify-between border-b border-slate-100 pb-1 mb-1">
                                <span>Tarih:</span>
                                <span className="font-bold">{new Date(serviceRequest.createdAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Müşteri:</span>
                                <span className="font-bold">{customer.name}</span>
                            </div>

                            <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                                {serviceRequest.actions && serviceRequest.actions.length > 0 ? (
                                    serviceRequest.actions.map((action, idx) => (
                                        <div key={idx} className="flex justify-between items-start gap-2">
                                            <span className="flex-1 text-[8px] leading-tight text-left">{idx + 1}-{action.description}</span>
                                            <span className="whitespace-nowrap font-bold">{Number(action.price).toLocaleString('tr-TR')} TL</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex justify-between font-bold">
                                        <span>Hizmet:</span>
                                        <span className="truncate max-w-[120px]">{serviceRequest.description}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1 pt-2 border-t border-slate-100 text-[8px]">
                            {serviceRequest.actions && serviceRequest.actions.length > 0 && (
                                <>
                                    <div className="flex justify-between">
                                        <span>Matrah:</span>
                                        <span>{(serviceRequest.actions.reduce((acc, a) => acc + Number(a.price), 0) / 1.20).toLocaleString('tr-TR')} TL</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>KDV DAHİL (%20):</span>
                                        <span>{(serviceRequest.actions.reduce((acc, a) => acc + Number(a.price), 0) - (serviceRequest.actions.reduce((acc, a) => acc + Number(a.price), 0) / 1.20)).toLocaleString('tr-TR')} TL</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t-2 border-dashed border-slate-200 mt-2">
                            <span className="font-black text-[10px] uppercase">Genel Toplam</span>
                            <span className="font-black text-xs">
                                {serviceRequest.actions && serviceRequest.actions.length > 0
                                    ? serviceRequest.actions.reduce((acc, a) => acc + Number(a.price), 0).toLocaleString('tr-TR')
                                    : Number(receipt.price).toLocaleString('tr-TR')
                                } TL
                            </span>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest italic">Makbuz Önizleme</p>
                </div>

                {/* Actions */}
                <div className="p-8 space-y-4">
                    {status === 'idle' || status === 'error' || status === 'connecting' ? (
                        <button
                            onClick={handleConnect}
                            disabled={status === 'connecting'}
                            className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all text-sm uppercase tracking-wider"
                        >
                            {status === 'connecting' ? 'Bağlanıyor...' : (
                                <>
                                    <Bluetooth size={18} />
                                    Yazıcıya Bağlan
                                </>
                            )}
                        </button>
                    ) : status === 'success' ? (
                        <div className="w-full h-14 bg-green-50 text-green-600 rounded-2xl font-black flex items-center justify-center gap-3 animate-in zoom-in duration-300">
                            <CheckCircle2 size={18} />
                            Yazdırıldı!
                        </div>
                    ) : ( // This else block now only covers 'connected' and 'printing'
                        <button
                            onClick={handlePrint}
                            disabled={status === 'printing'}
                            className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-slate-200 hover:bg-black active:scale-95 transition-all text-sm uppercase tracking-wider"
                        >
                            {status === 'printing' ? 'Yazdırılıyor...' : (
                                <>
                                    <Printer size={18} />
                                    FİŞİ YAZDIR
                                </>
                            )}
                        </button>
                    )}

                    {errorMsg && (
                        <div className="flex items-center gap-2 text-red-600 justify-center animate-shake">
                            <AlertCircle size={14} />
                            <span className="text-[11px] font-bold">{errorMsg}</span>
                        </div>
                    )}

                    <p className="text-[10px] text-center text-slate-400 font-medium">Bu işlem için Bluetooth ve Konum izinleri gereklidir.</p>
                </div>

            </div>
        </div>
    );
}
