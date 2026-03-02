'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        slug: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/dashboard');
            } else {
                setError(data.error || 'Kayıt başarısız oldu');
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">ServiceFlow</h1>
                    <p className="mt-2 text-sm text-slate-500 font-medium tracking-tight">İşletmeni dijitale taşıyoruz!</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 ml-1 uppercase" htmlFor="name">İşletme Adı</label>
                        <input
                            id="name"
                            name="name"
                            required
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-0 transition-all font-medium sm:text-sm"
                            placeholder="Ahmet Elektronik"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 ml-1 uppercase" htmlFor="slug">İşletme Takma Adı (URL slug)</label>
                        <input
                            id="slug"
                            name="slug"
                            required
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-0 transition-all font-medium sm:text-sm"
                            placeholder="ahmet-elektronik"
                            value={formData.slug}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 ml-1 uppercase" htmlFor="email">E-posta</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-0 transition-all font-medium sm:text-sm"
                            placeholder="eposta@isletme.com"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 ml-1 uppercase" htmlFor="password">Şifre</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-0 transition-all font-medium sm:text-sm"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 mt-4 h-14"
                    >
                        {loading ? 'Hesap Oluşturuluyor...' : 'Hemen Kayıt Ol'}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm text-slate-500 font-medium">
                        Zaten hesabın var mı?{' '}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            Giriş Yap
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
