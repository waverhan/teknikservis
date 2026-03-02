import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import Image from "next/image";
import PublicRequestForm from "@/components/PublicRequestForm";

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
        },
    });

    if (!business) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 py-8">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200 overflow-hidden border border-slate-100 mb-8">
                {/* Business Header */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                        </svg>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        {business.logo ? (
                            <Image
                                src={business.logo}
                                alt={business.name}
                                width={80}
                                height={80}
                                className="w-20 h-20 rounded-3xl bg-white p-2 shadow-lg mb-4 object-contain"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold mb-4 border border-white/30 shadow-lg">
                                {business.name.substring(0, 1).toUpperCase()}
                            </div>
                        )}
                        <h1 className="text-2xl font-black tracking-tight leading-tight">{business.name}</h1>
                        <p className="text-blue-100 text-sm font-medium mt-1 opacity-90">Teknik Servis Başvuru Formu</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <PublicRequestForm slug={business.slug} />
                </div>
            </div>

            {/* Footer Info */}
            <div className="text-center text-slate-400 space-y-2 max-w-xs">
                <p className="text-[10px] font-bold uppercase tracking-widest">İletişim Bilgileri</p>
                {business.phone && <p className="text-sm font-medium">{business.phone}</p>}
                {business.address && <p className="text-xs">{business.address}</p>}
                <div className="pt-4 flex flex-col items-center opacity-50">
                    <p className="text-[10px] font-medium">Powered by</p>
                    <p className="text-[11px] font-black text-blue-600 tracking-tighter uppercase italic">ServiceFlow</p>
                </div>
            </div>
        </div>
    );
}
