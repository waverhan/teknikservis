import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import PublicRequestForm from "@/components/PublicRequestForm";
import { Phone, MapPin, ExternalLink, Globe, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PublicBusinessPage({
    params,
}: {
    params: { slug: string };
}) {
    const business = await prisma.business.findUnique({
        where: { slug: params.slug },
        select: {
            id: true,
            name: true,
            logo: true,
            address: true,
            phone: true,
            slug: true,
            primaryColor: true,
            publicDescription: true,
            googleMapsUrl: true,
        },
    });

    if (!business) {
        notFound();
    }

    const primaryColor = business.primaryColor || "#3B82F6";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 py-12 md:py-20 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 flex flex-col">

                {/* Header Section */}
                <div
                    className="p-10 md:p-14 text-center text-white relative transition-all duration-1000"
                    style={{ backgroundColor: primaryColor }}
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <circle cx="10" cy="10" r="30" fill="white" />
                            <circle cx="90" cy="80" r="20" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="group relative">
                            <div className="absolute -inset-2 bg-white/20 rounded-[2.5rem] blur-xl group-hover:blur-2xl transition-all" />
                            {business.logo ? (
                                <Image
                                    src={business.logo}
                                    alt={business.name}
                                    width={100}
                                    height={100}
                                    className="w-24 h-24 rounded-3xl bg-white p-3 shadow-2xl mb-6 object-contain relative z-10 transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-4xl font-black mb-6 border border-white/30 shadow-2xl relative z-10 uppercase italic">
                                    {business.name.substring(0, 1)}
                                </div>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none uppercase italic">{business.name}</h1>
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                            <Star size={14} className="fill-white" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Resmi Teknik Servis</span>
                        </div>
                    </div>
                </div>

                {/* About Section (New) */}
                {business.publicDescription && (
                    <div className="p-10 md:p-14 bg-slate-50/50 border-b border-slate-100 text-center">
                        <p className="text-lg md:text-xl font-bold text-slate-700 leading-relaxed italic">
                            &quot;{business.publicDescription}&quot;
                        </p>
                    </div>
                )}

                {/* Main Content: Form */}
                <div className="p-10 md:p-14 space-y-12">
                    <div className="space-y-4 text-center">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Servis Kaydı Oluştur</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Arızalı cihazınız için hızlıca talep bırakın</p>
                    </div>

                    <PublicRequestForm slug={business.slug} />
                </div>

                {/* Contact & Maps Section */}
                <div className="border-t border-slate-50 bg-white p-10 md:p-14 grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 pl-4" style={{ borderColor: primaryColor }}>İLETİŞİM</h3>
                        <div className="space-y-4">
                            {business.phone && (
                                <a href={`tel:${business.phone}`} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-all">{business.phone}</span>
                                </a>
                            )}
                            {business.address && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mt-1">
                                        <MapPin size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-500 leading-relaxed">{business.address}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {(business.address || business.googleMapsUrl) && (
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 pl-4" style={{ borderColor: primaryColor }}>KONUM</h3>
                            <div className="aspect-square md:aspect-video bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner relative group">
                                {business.address ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(business.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <a
                                        href={business.googleMapsUrl || '#'}
                                        target="_blank"
                                        className="w-full h-full flex flex-col items-center justify-center text-center p-6 transition-all hover:bg-slate-200"
                                    >
                                        <Globe size={48} className="text-slate-400 mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Haritayı Google&apos;da Aç</p>
                                    </a>
                                )}
                            </div>
                            {business.googleMapsUrl && (
                                <a
                                    href={business.googleMapsUrl}
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                                >
                                    <span>Tam Haritada Görüntüle</span>
                                    <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 flex flex-col items-center gap-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Powered by</p>
                    <span className="text-xs font-black text-blue-600 tracking-tighter uppercase italic">ServiceFlow</span>
                </div>
            </footer>
        </div>
    );
}
