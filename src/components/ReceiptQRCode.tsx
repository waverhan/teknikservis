'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { Share2, Smartphone, Monitor, Check } from 'lucide-react';

interface ReceiptQRCodeProps {
    receiptId: string;
}

export default function ReceiptQRCode({ receiptId }: ReceiptQRCodeProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(receiptId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="card border-slate-100 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
                <Smartphone className="text-blue-600" size={18} />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Mobil Yazdırma (V2)</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm mb-4">
                <QRCodeSVG
                    value={receiptId}
                    size={160}
                    level="H"
                    includeMargin={true}
                />
            </div>

            <div className="text-center px-4 mb-6">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 leading-tight tracking-tight">Karekod Okutun</p>
                <p className="text-[11px] text-slate-500 font-medium leading-tight tracking-tight">iOS cihazınızdan yazdırmak için <br /> mobil uygulamayı açıp bu kodu tarayın.</p>
            </div>

            <div className="w-full flex gap-2">
                <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-wider"
                >
                    {copied ? <Check size={12} className="text-green-500" /> : <Monitor size={12} />}
                    {copied ? 'Kopyalandı' : 'ID Kopyala'}
                </button>
                <button className="p-2.5 rounded-xl border border-slate-100 text-slate-600 hover:bg-slate-50 transition-all">
                    <Share2 size={12} />
                </button>
            </div>
        </div>
    );
}
