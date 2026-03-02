import BottomNav from "@/components/BottomNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-slate-50">
            <main className="mx-auto max-w-md bg-white min-h-screen pb-20 shadow-xl overflow-x-hidden md:border-x md:border-slate-100">
                {children}
            </main>
            <div className="mx-auto max-w-md relative">
                <BottomNav />
            </div>
        </div>
    );
}
