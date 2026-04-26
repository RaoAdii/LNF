import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import DotGrid from '@components/DotGrid';

const stats = [
  { label: 'Lost Items', value: 24, icon: ShieldCheck },
  { label: 'Found Items', value: 18, icon: Sparkles },
  { label: 'Resolved', value: 11, icon: Zap },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0914] text-white">
      <div className="absolute inset-0 opacity-95" aria-hidden="true">
        <DotGrid
          dotSize={10}
          gap={15}
          baseColor="#2b2347"
          activeColor="#b38fff"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 16%, rgba(111, 75, 255, 0.24) 0%, rgba(10, 9, 20, 0.66) 42%, rgba(10, 9, 20, 0.95) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container-lg px-4 md:px-6 pt-28 md:pt-32 pb-10">
        <main className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-center">
          <section className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-dm text-[#dbe2ff]">
              <span className="inline-flex items-center rounded-full bg-[#8d7bff]/35 text-white px-2 py-0.5 font-semibold border border-[#b38fff]/50">NEW</span>
              <span>Faster listings and realtime chat</span>
            </div>

            <h1 className="mt-5 text-4xl md:text-6xl font-syne font-bold leading-[1.05] text-[#f3f5ff]">
              Community Lost and Found, Reimagined
            </h1>
            <p className="mt-5 text-lg md:text-[1.9rem] text-[#c8d1ef] font-dm font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Post listings, discover matches, and reconnect quickly with secure in-app communication.
            </p>
            <p className="mt-3 text-sm md:text-base text-[#9eaad2] font-dm max-w-2xl mx-auto lg:mx-0">
              Built with JWT authentication, MongoDB storage, and realtime messaging for listers and contacts.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold border border-[#9b88ff]/70 bg-[#8d7bff] text-white hover:bg-[#9b88ff]"
              >
                Report an Item
              </Link>
              <Link
                to="/home"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium border border-white/18 bg-white/[0.04] text-[#dce4ff] hover:bg-white/[0.08]"
              >
                <span className="inline-flex items-center gap-2">
                  <span>Browse Listings</span>
                  <ArrowRight size={15} />
                </span>
              </Link>
            </div>
          </section>

          <section className="lg:col-span-5 rounded-[24px] border border-white/12 bg-white/[0.04] p-5 md:p-6 shadow-[0_14px_40px_rgba(0,0,0,0.38)]">
            <div className="space-y-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center justify-between text-xs text-[#bfc8e8] font-dm">
                    <span>{label}</span>
                    <Icon size={14} className="text-[#87a3ff]" />
                  </div>
                  <p className="mt-1 text-3xl font-syne font-bold text-[#f2f5ff]">{value}</p>
                </div>
              ))}
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#bfc8e8] font-dm">
                <Search size={16} className="text-[#87a3ff]" />
                Search by title, location, category, and type.
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
