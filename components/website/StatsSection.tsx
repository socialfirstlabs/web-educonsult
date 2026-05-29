"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  label: string;
}

function parseValue(raw: string): { num: number; suffix: string } {
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: raw };
  return { num: parseFloat(match[1]), suffix: match[2] };
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [active, target, duration]);
  return count;
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const { num, suffix } = parseValue(stat.value);
  const count = useCountUp(num, 1400, active);
  return (
    <div className="text-center p-10 bg-white rounded-3xl shadow-md border border-jn-border transition-transform duration-300 hover:-translate-y-1.5 hover:border-jn-accent">
      <div
        className="font-[family-name:var(--font-poppins)] text-5xl font-bold text-jn-primary mb-2 leading-none"
        aria-label={stat.value}
      >
        <span aria-hidden="true">{active ? `${count}${suffix}` : stat.value}</span>
      </div>
      <div className="text-[0.95rem] font-medium text-jn-text-muted">{stat.label}</div>
    </div>
  );
}

export default function StatsSection({ stats }: { stats: Stat[] }) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="jn-section bg-jn-primary-light">
      <div
        ref={ref}
        className="jn-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </section>
  );
}
