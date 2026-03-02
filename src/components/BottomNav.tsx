'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, ClipboardList, Settings, ReceiptText } from 'lucide-react';

const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { label: 'Ana Sayfa', icon: Home, href: '/dashboard' },
        { label: 'Müşteriler', icon: Users, href: '/dashboard/customers' },
        { label: 'İş Emirleri', icon: ClipboardList, href: '/dashboard/service-requests' },
        { label: 'Makbuzlar', icon: ReceiptText, href: '/dashboard/receipts' },
        { label: 'Ayarlar', icon: Settings, href: '/dashboard/settings' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/80 backdrop-blur-md pb-safe">
            <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
                {navItems.map(({ label, icon: Icon, href }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-1 flex-col items-center justify-center space-y-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'
                                }`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
