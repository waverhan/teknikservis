import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import PublicRequestForm from "@/components/PublicRequestForm";
import { ChevronLeft } from "lucide-react";
import Link from 'next/link';

export const dynamic = "force-dynamic";

interface RequestPageProps {
    params: { slug: string };
}

export default async function RequestPage({ params }: RequestPageProps) {
    const business = await prisma.business.findUnique({
        where: { slug: params.slug },
        select: {
            id: true,
            name: true,
            logo: true,
            slug: true,
            primaryColor: true,
            isPublic: true,
        },
    });

    if (!business || !business.isPublic) {
        notFound();
    }

    const primaryColor = business.primaryColor || "#3B82F6";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 py-12 md:py-20 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 flex flex-col">

                {/* Header Section */}
                <div
                    className="p-8 md:p-10 text-center text-white relative transition-all duration-1000 flex flex-col items-center"
                    style={{ backgroundColor: primaryColor }}
                >
                    <Link href={`/t/${params.slug}`} className="absolute left-6 top-8 p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                        <ChevronLeft size={20} strokeWidth={3} />
                    </Link>

                    <div className="relative z-10 flex flex-col items-center mt-4">
                        {business.logo ? (
                            <Image
                                src={business.logo}
                                alt={business.name}
                                width={60}
                                height={60}
                                className="w-16 h-16 rounded-2xl bg-white p-2 shadow-2xl mb-4 object-contain"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-2xl font-black mb-4 border border-white/30 shadow-2xl uppercase italic">
                                {business.name.substring(0, 1)}
                            </div>
                        )}
                        <h1 className="text-xl font-black tracking-tighter leading-none uppercase italic">{business.name}</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mt-1">Servis Kaydı Formu</p>
                    </div>
                </div>

                {/* Main Content: Form */}
                <div className="p-10 md:p-14 space-y-12">
                    <div className="space-y-4 text-center">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Detayları Paylaşın</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Size en kısa sürede dönüş yapacağız</p>
                    </div>

                    <PublicRequestForm slug={business.slug} />
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 flex flex-col items-center gap-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Powered by</p>
                    <span className="text-xs font-black text-blue-600 tracking-tighter uppercase italic">Teknik Servis</span>
                </div>
            </footer>
        </div>
    );
}
