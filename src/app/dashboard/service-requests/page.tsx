'use client';

import { useState, useEffect } from 'react';
import {
    ClipboardList,
    Plus,
    Search,
    ChevronRight,
    Loader2,
    ArrowLeft,
    Clock,
    CheckCircle2,
    PlayCircle,
    Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ServiceRequest {
    id: string;
    description: string;
    deviceBrand?: string;
    deviceModel?: string;
    status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt: string;
    customer: {
        name: string;
    };
}

export default function ServiceRequestsPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetch('/api/service-requests')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setRequests(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = requests.filter(r =>
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.deviceBrand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.deviceModel?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'COMPLETED': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'NEW': return <Clock size={12} />;
            case 'IN_PROGRESS': return <PlayCircle size={12} />;
            case 'COMPLETED': return <CheckCircle2 size={12} />;
            default: return null;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'NEW': return 'Yeni';
            case 'IN_PROGRESS': return 'İşlemde';
            case 'COMPLETED': return 'Tamamlandı';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">İş Emirleri Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 px-4 py-8">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">İş Emirleri</h1>
                </div>
                <Link
                    href="/dashboard/service-requests/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-95 transition-all"
                >
                    <Plus size={18} />
                    <span>Yeni İş</span>
                </Link>
            </header>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Müşteri adı, marka veya arıza..."
                    className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-medium focus:border-blue-500 outline-none shadow-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="p-12 bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem] text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <ClipboardList className="text-slate-300" size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-900">İş Emri Bulunmuyor</p>
                        <p className="text-xs text-slate-500 mt-1">Henüz açılmış bir iş emri bulunmuyor.</p>
                    </div>
                ) : (
                    filtered.map(request => (
                        <Link
                            key={request.id}
                            href={`/dashboard/service-requests/${request.id}`}
                            className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm hover:border-blue-100 transition-all active:scale-[0.98] group block"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(request.status)}`}>
                                            {getStatusIcon(request.status)}
                                            {getStatusLabel(request.status)}
                                        </div>
                                        {(request.deviceBrand || request.deviceModel) && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-tight bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                                                <Smartphone size={10} />
                                                <span>{request.deviceBrand} {request.deviceModel}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-black text-slate-900 uppercase tracking-tight line-clamp-2 mt-2">{request.description}</h3>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 mt-1 group-hover:text-blue-500 transition-colors" />
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{request.customer.name}</span>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                    {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
stone
