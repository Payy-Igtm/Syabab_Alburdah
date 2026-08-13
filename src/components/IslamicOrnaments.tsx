export default function IslamicOrnaments() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Bintang geometris berputar pelan (rub el hizb) */}
      <svg
        viewBox="0 0 100 100"
        className="animate-spin-slow absolute -right-10 -top-10 h-56 w-56 text-gold-400/20 md:h-72 md:w-72"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <polygon points="50,4 61,32 91,32 67,50 76,79 50,61 24,79 33,50 9,32 39,32" />
          <circle cx="50" cy="50" r="46" strokeOpacity="0.5" />
        </g>
      </svg>

      {/* Bulan sabit melayang */}
      <svg
        viewBox="0 0 64 64"
        className="animate-float-a absolute left-[8%] top-[18%] h-10 w-10 text-gold-300/70 md:h-14 md:w-14"
      >
        <path
          fill="currentColor"
          d="M42 6C28 6 17 17 17 31s11 25 25 25c4 0 7.7-.9 11-2.5C44 57 34 62 22.5 62 8.9 62 -2 51.1 -2 37.5S8.9 13 22.5 13c4.5 0 8.7 1.2 12.3 3.3C36.7 8.9 39.2 6 42 6z"
          transform="translate(2 0)"
        />
      </svg>

      {/* Bintang kecil berkedip, tersebar */}
      <Star className="absolute left-[18%] top-[55%] h-3 w-3 animate-twinkle text-gold-200" delay="0s" />
      <Star className="absolute left-[30%] top-[15%] h-2.5 w-2.5 animate-twinkle text-gold-200" delay="0.8s" />
      <Star className="absolute right-[28%] top-[70%] h-3 w-3 animate-twinkle text-gold-300" delay="1.6s" />
      <Star className="absolute right-[15%] top-[38%] h-2 w-2 animate-twinkle text-gold-200" delay="2.2s" />
      <Star className="absolute left-[45%] top-[80%] h-2.5 w-2.5 animate-twinkle text-gold-300" delay="1.1s" />

      {/* Ornamen kubah masjid mengambang halus */}
      <svg
        viewBox="0 0 100 100"
        className="animate-float-b absolute bottom-[6%] left-[6%] h-14 w-14 text-gold-400/25 md:h-20 md:w-20"
      >
        <path
          fill="currentColor"
          d="M50 6c8 6 12 14 12 22 8 2 14 9 14 18v6H24v-6c0-9 6-16 14-18 0-8 4-16 12-22z"
        />
        <rect x="46" y="0" width="8" height="8" fill="currentColor" />
        <rect x="20" y="54" width="60" height="8" fill="currentColor" />
      </svg>

      {/* Belah ketupat geometris kecil mengambang */}
      <svg
        viewBox="0 0 40 40"
        className="animate-float-c absolute right-[10%] bottom-[16%] h-8 w-8 text-gold-300/40 md:h-10 md:w-10"
      >
        <rect x="8" y="8" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.4" transform="rotate(45 20 20)" />
      </svg>
    </div>
  );
}

function Star({ className, delay }: { className?: string; delay: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ animationDelay: delay }}>
      <path
        fill="currentColor"
        d="M12 0l2.2 8.2L22 12l-7.8 3.8L12 24l-2.2-8.2L2 12l7.8-3.8z"
      />
    </svg>
  );
}
