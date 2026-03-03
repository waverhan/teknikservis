'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Search,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Customer {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetch('/api/customers')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCustomers(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Müşteriler Yükleniyor...</p>
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
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Müşteriler</h1>
                </div>
                <Link
                    href="/dashboard/customers/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-95 transition-all"
                >
                    <Plus size={18} />
                    <span>Yeni Ekle</span>
                </Link>
            </header>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Müşteri ismi veya telefon..."
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
                            <Users className="text-slate-300" size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-900">Müşteri Bulunamadı</p>
                        <p className="text-xs text-slate-500 mt-1">Hemen yeni bir müşteri ekleyerek başlayın.</p>
                    </div>
                ) : (
                    filtered.map(customer => (
                        <Link
                            key={customer.id}
                            href={`/dashboard/customers/${customer.id}/edit`}
                            className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm hover:border-blue-100 transition-all active:scale-[0.98] block"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-slate-900">{customer.name}</h3>
                                <ChevronRight size={16} className="text-slate-300" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                    <Phone size={14} className="text-blue-500" />
                                    <span>{customer.phone}</span>
                                </div>
                                {customer.email && (
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <Mail size={14} />
                                        <span>{customer.email}</span>
                                    </div>
                                )}
                                {customer.address && (
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <MapPin size={14} />
                                        <span className="truncate">{customer.address}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
