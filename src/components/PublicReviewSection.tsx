'use client';

import { useState } from 'react';
import { Star, MessageCircle, User, Loader2 } from "lucide-react";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    customerName: string;
    createdAt: Date;
}

interface PublicReviewSectionProps {
    businessId: string;
    initialReviews: Review[];
    primaryColor: string;
}

export default function PublicReviewSection({ businessId, initialReviews, primaryColor }: PublicReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        rating: 5,
        comment: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/public/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessId,
                    ...formData
                }),
            });

            if (res.ok) {
                const newReview = await res.json();
                setReviews([newReview, ...reviews]);
                setShowForm(false);
                setFormData({ customerName: '', rating: 5, comment: '' });
            }
        } catch (error) {
            console.error('Review submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    return (
        <div className="p-10 md:p-14 border-t border-slate-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Müşteri Yorumları</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    size={14}
                                    className={`${s <= Number(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-slate-400">{reviews.length} Değerlendirme</span>
                    </div>
                </div>

                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 bg-white border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        style={{ borderColor: primaryColor, color: primaryColor }}
                    >
                        <MessageCircle size={16} />
                        <span>Yorum Yap</span>
                    </button>
                )}
            </div>

            {showForm && (
                <div className="mb-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight italic mb-6">Deneyiminizi Paylaşın</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Adınız Soyadınız</label>
                            <input
                                required
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="Örn: Erhan .."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Puanınız</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className="transition-transform active:scale-90"
                                    >
                                        <Star
                                            size={28}
                                            className={`${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 hover:text-yellow-200'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Yorumunuz</label>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="Hizmet hakkında ne düşünüyorsunuz?"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 py-4 bg-white text-slate-500 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/10 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Gönder'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-10 opacity-40">
                        <p className="text-xs font-bold uppercase tracking-widest italic">Henüz yorum yapılmamış.</p>
                    </div>
                ) : (reviews && Array.isArray(reviews) && reviews.map((review) => (
                    <div key={review.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                    <User size={14} />
                                </div>
                                <span className="text-sm font-black text-slate-900 italic uppercase">{review.customerName}</span>
                            </div>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={10}
                                        className={`${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-100'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        {review.comment && (
                            <p className="text-sm text-slate-600 font-medium leading-relaxed pl-11">
                                {review.comment}
                            </p>
                        )}
                        <div className="h-px bg-slate-50 w-full mt-6" />
                    </div>
                ))
                )}
            </div>
        </div>
    );
}
