'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Smartphone,
  Zap,
  Users,
  Printer,
  Globe,
  ShieldCheck,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Star
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Zap className="text-white fill-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 uppercase">Teknik<span className="text-blue-600">Servis</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#ozellikler" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Özellikler</a>
            <a href="#fiyat" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Fiyatlandırma</a>
            <a href="#iletisim" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">İletişim</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition-all">Giriş Yap</Link>
            <Link href="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black active:scale-95 transition-all">Ücretsiz Başla</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-black uppercase tracking-widest">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              Yeni Nesil Servis Yönetimi
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              Teknik Servisinizi <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Cebinizden</span> Yönetin.
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
              Müşteri kayıtlarından iş emirlerine, bluetooth makbuz çıktılarından stok takibine kadar her şey tek bir platformda. Hem webde hem mobilde.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register" className="h-16 px-8 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
                <span>Hemen Başla</span>
                <ArrowRight size={20} />
              </Link>
              <Link href="#ozellikler" className="h-16 px-8 bg-white text-slate-900 border border-slate-200 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all shadow-sm">
                Turu Başlat
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-4 grayscale opacity-60">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200" />)}
              </div>
              <p className="text-xs font-bold text-slate-400">500+ Aktif İşletme Bizi Tercih Etti</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-blue-400/20 blur-[100px] rounded-full" />
            <div className="relative bg-white p-4 rounded-[2.5rem] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)] border border-slate-100 animate-float">
              <Image
                src="/hero-mockup.png"
                alt="Dashboard Mockup"
                width={800}
                height={600}
                className="rounded-[1.5rem]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features section */}
      <section id="ozellikler" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Hız ve Verimlilik</h2>
            <p className="text-4xl font-black text-slate-900 tracking-tight">İhtiyacınız Olan Her Şey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Akıllı Müşteri Yönetimi', desc: 'Müşterilerinizin geçmiş servis kayıtlarına, cihaz bilgilerine ve iletişim geçmişine saniyeler içinde erişin.' },
              { icon: Zap, title: 'Hızlı İş Emri Takibi', desc: 'Arıza kayıtlarını oluşturun, durumlarını anlık takip edin ve teknisyenlerinize görev atayın.' },
              { icon: Printer, title: 'Bluetooth Makbuz Çıktısı', desc: 'Android ve iOS cihazlardan termal yazıcılara anında bağlanın ve profesyonel makbuzlar verin.' },
              { icon: Globe, title: 'Multi-Tenant Altyapı', desc: 'Her işletmeye özel alt alan adı ve özelleştirilebilir başvuru sayfaları ile kendi markanızı öne çıkarın.' },
              { icon: Smartphone, title: 'Tam Mobil Uyum', desc: 'Bilgisayarda başladığınız işi sahada telefonunuzdan tamamlayın. Tüm platformlar senkronize.' },
              { icon: ShieldCheck, title: 'Bulut Güvenliği', desc: 'Verileriniz en güvenli sunucularda her gün yedeklenir. Veri kaybı korkusu yaşamazsınız.' }
            ].map((f, i) => (
              <div key={i} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 text-blue-600">
                  <f.icon size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-3">{f.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="fiyat" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Adil Fiyatlandırma</h2>
            <p className="text-4xl font-black text-slate-900 tracking-tight">Büyümenize Engel Olmayan Planlar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Başlangıç', price: '0', period: 'Her zaman ücretsiz', features: ['50 Müşteri Kaydı', 'Sınırsız İş Emri', 'Mobil Uyum', 'Standart Raporlama'], btn: 'Ücretsiz Katıl', highlight: false },
              { name: 'Profesyonel', price: '499', period: '/ aylık', features: ['Sınırsız Müşteri', 'Bluetooth Yazdırma', 'Özel QR Kodlar', 'WhatsApp Entegrasyonu', 'Öncelikli Destek'], btn: 'Denemeye Başla', highlight: true },
              { name: 'Kurumsal', price: '999', period: '/ aylık', features: ['Sınırsız Şube', 'Özel Alan Adı', 'API Erişimi', '7/24 VIP Destek', 'Beyaz Etiket (White Label)'], btn: 'Bize Ulaşın', highlight: false }
            ].map((p, i) => (
              <div key={i} className={`p-8 bg-white rounded-[3rem] border border-slate-200 flex flex-col relative overflow-hidden ${p.highlight ? 'ring-4 ring-blue-600/10 border-blue-600 scale-105 z-10' : ''}`}>
                {p.highlight && <div className="absolute top-0 right-12 bg-blue-600 text-white px-4 py-1.5 rounded-b-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Popüler</div>}
                <div className="mb-8">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">{p.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{p.price}</span>
                    <span className="text-sm font-bold text-slate-400 italic">TL {p.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {p.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-sm font-bold text-slate-600 uppercase tracking-tight">
                      <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 ${p.highlight ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700' : 'bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100'}`}>
                  {p.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600 blur-[150px] opacity-20 rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black tracking-tight leading-tight">Yüzlerce teknik servis sahibinin işini hafiflettik.</h2>
              <div className="space-y-6">
                {[
                  { name: 'Kaan Aksoy', role: 'Aksoy Teknik', quote: 'Sadece mobilden iş emri oluşturup bluetooth yazıcıdan makbuz çıkarabilmek bile tüm iş hızımızı iki katına çıkardı.' },
                  { name: 'Selin Yıldız', role: 'Yıldız Elektronik', quote: 'Müşterilerimin durum sorgulama sayfasını çok beğenmesi marka imajımı bambaşka bir noktaya taşıdı.' }
                ].map((t, i) => (
                  <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-yellow-400 fill-yellow-400" />)}
                    </div>
                    <p className="text-lg font-medium italic mb-4 opacity-80">&quot;{t.quote}&quot;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20" />
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest">{t.name}</p>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-md space-y-8">
              <h3 className="text-2xl font-black tracking-tight">En Çok Tercih Edilen Özellikler</h3>
              <div className="space-y-4">
                {[
                  { label: 'Kullanım Kolaylığı', percent: 98 },
                  { label: 'Mobil Performans', percent: 95 },
                  { label: 'Destek Hızı', percent: 100 },
                  { label: 'Güvenlik & Yedekleme', percent: 99 }
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span className="opacity-60">{stat.label}</span>
                      <span className="text-blue-400">{stat.percent}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]" style={{ width: `${stat.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
            Daha Az Kağıt, <br /> Daha Çok İş.
          </h2>
          <p className="text-lg text-slate-500 font-medium italic">
            &quot;Teknik servis yönetimi hiç bu kadar akıcı ve profesyonel olmamıştı.&quot;
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="h-16 px-10 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
              Ücretsiz Kayıt Ol
            </Link>
            <Link href="#iletisim" className="h-16 px-10 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center hover:bg-black active:scale-95 transition-all shadow-xl shadow-slate-200">
              Tanıtım İste
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="iletisim" className="bg-slate-50 pt-24 pb-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white fill-white" size={16} />
                </div>
                <span className="text-lg font-black tracking-tight uppercase">Teknik<span className="text-blue-600">Servis</span></span>
              </div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm uppercase tracking-tight">
                Türkiye&apos;nin en gelişmiş bulut tabanlı teknik servis yönetim platformu. İşletmenizi geleceğe taşıyın.
              </p>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 bg-white border border-slate-200 rounded-xl hover:border-blue-500 transition-all cursor-pointer shadow-sm shadow-slate-100" />)}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">İletişim</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600 uppercase tracking-tight">
                  <Mail size={16} className="text-blue-500" /> info@teknikservis.info
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600 uppercase tracking-tight">
                  <Phone size={16} className="text-blue-500" /> 0850 300 00 00
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600 uppercase tracking-tight">
                  <MapPin size={16} className="text-blue-500" /> Maslak, İstanbul
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Yardım</h4>
              <ul className="space-y-4">
                <li className="text-sm font-bold text-slate-600 uppercase tracking-tight hover:text-blue-600 cursor-pointer">Sık Sorulan Sorular</li>
                <li className="text-sm font-bold text-slate-600 uppercase tracking-tight hover:text-blue-600 cursor-pointer">Kullanım Kılavuzu</li>
                <li className="text-sm font-bold text-slate-600 uppercase tracking-tight hover:text-blue-600 cursor-pointer">KVKK Metni</li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-12 border-t border-slate-200 flex flex-col items-center gap-2">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">&copy; 2024 Teknik Servis Hub. Tüm Hakları Saklıdır.</p>
            <div className="w-1 h-1 bg-slate-200 rounded-full" />
            <p className="text-[8px] font-black text-slate-200 uppercase tracking-widest italic">Crafted with precision for professionals</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
