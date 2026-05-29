"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:bg-white/20 hover:border-white/20"
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full text-left px-6 py-6 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-jn-accent group"
          >
            <span className="font-[family-name:var(--font-poppins)] font-medium text-[1.1rem] md:text-[1.15rem] text-white group-hover:text-yellow-200 transition-colors">
              {item.question}
            </span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 ml-4 group-hover:bg-jn-accent group-hover:scale-105 transition-all">
              <svg
                className={`w-5 h-5 text-white group-hover:text-jn-text-dark transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              open === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="px-6 pb-6 text-[1.05rem] text-white/85 leading-relaxed border-t border-white/10 pt-5 mt-2">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
