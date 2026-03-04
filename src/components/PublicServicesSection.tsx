'use client';

import { Wrench } from "lucide-react";

interface Service {
    id: string;
    name: string;
    description: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    price: any;
}

interface PublicServicesSectionProps {
    services: Service[];
    primaryColor: string;
}

export default function PublicServicesSection({ services, primaryColor }: PublicServicesSectionProps) {
    if (!services || services.length === 0) return null;

    return (
        <div className="p-10 md:p-14 border-t border-slate-50 bg-slate-50/30">
            <div className="space-y-4 text-center mb-10">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Hizmetlerimiz</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center">Size en iyi çözümleri sunuyoruz</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <Wrench size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{service.name}</h3>
                                {service.description && (
                                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{service.description}</p>
                                )}
                                {service.price && (
                                    <p className="text-xs font-black mt-2" style={{ color: primaryColor }}>
                                        ₺{Number(service.price).toFixed(2)}&apos;den başlayan fiyatlarla
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
