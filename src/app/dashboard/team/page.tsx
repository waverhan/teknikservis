'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Shield, Wrench, Mail } from 'lucide-react';

interface IUser {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'TECHNICIAN';
    createdAt: string;
}

export default function TeamPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({ email: '', password: '', name: '', role: 'TECHNICIAN' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        fetch('/api/business/users')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setUsers(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch('/api/business/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Hata oluştu');

            setShowAddModal(false);
            setForm({ email: '', password: '', name: '', role: 'TECHNICIAN' });
            fetchUsers();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col space-y-6 px-4 py-8 max-w-4xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Ekip Yönetimi</h1>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Teknisyenler ve Roller</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                    <UserPlus size={16} />
                    Yeni Üye
                </button>
            </header>

            <div className="grid gap-4">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-24 bg-white border border-slate-100 rounded-3xl animate-pulse" />
                    ))
                ) : users.map((user) => (
                    <div key={user.id} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-500' : 'bg-blue-50 text-blue-500'}`}>
                                {user.role === 'ADMIN' ? <Shield size={20} /> : <Wrench size={20} />}
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{user.name}</h3>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-0.5">
                                    <Mail size={10} />
                                    <span>{user.email}</span>
                                    <span className="opacity-30">•</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] ${user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {user.role === 'ADMIN' ? 'ADMİN' : 'TEKNİSYEN'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-[10px] font-bold text-slate-300 mr-2 uppercase tracking-tighter italic">
                                Katılım: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <form onSubmit={handleAddUser} className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 relative animate-in slide-in-from-bottom-8 duration-500">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">Yeni Ekip Üyesi</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8 italic">Teknisyen Hesabı Oluştur</p>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">AD SOYAD</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Teknisyen Adı..."
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">E-POSTA</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="ornek@mail.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ŞİFRE</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ROL</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, role: 'TECHNICIAN' })}
                                        className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${form.role === 'TECHNICIAN' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                                    >
                                        Teknisyen
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, role: 'ADMIN' })}
                                        className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${form.role === 'ADMIN' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && <p className="mt-4 text-[10px] font-bold text-red-500 text-center uppercase tracking-widest">{error}</p>}

                        <div className="flex gap-3 mt-8">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 h-16 bg-slate-50 text-slate-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-2 px-8 h-16 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {saving ? 'Kaydediliyor...' : 'Üyeyi Ekle'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
