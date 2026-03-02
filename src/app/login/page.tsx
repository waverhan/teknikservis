'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/dashboard');
            } else {
                setError(data.error || 'Giriş başarısız oldu');
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
                    <p className="mt-2 text-sm text-slate-500 font-medium tracking-tight">İşletmene tekrar hoş geldin!</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 ml-1 uppercase" htmlFor="email">E-posta</label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-0 transition-all font-medium sm:text-sm"
                            placeholder="eposta@isletme.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 ml-1 uppercase" htmlFor="password">Şifre</label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-0 transition-all font-medium sm:text-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 mt-4 h-14"
                    >
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm text-slate-500 font-medium">
                        Henüz bir hesabın yok mu?{' '}
                        <Link href="/register" className="text-blue-600 font-bold hover:underline">
                            Hemen Kayıt Ol
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
