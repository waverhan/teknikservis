'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton({ url, title }: { url: string; title: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `${title} - Teknik Servis Başvuru Formu`,
                    url: url,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            // Fallback to copy to clipboard
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={handleShare}
                className="p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2 group"
            >
                <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Paylaş</span>
            </button>

            {copied && (
                <div className="absolute top-full mt-2 px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-full animate-bounce">
                    Link Kopyalandı!
                </div>
            )}
        </div>
    );
}
