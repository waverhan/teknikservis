'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function SettingsPage() {
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-6">Ayarlar</h1>

            <div className="space-y-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
                >
                    <LogOut size={20} strokeWidth={2.5} />
                    <span>Çıkış Yap</span>
                </button>
            </div>
        </div>
    );
}
