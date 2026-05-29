"use client";

import { useEffect } from "react";

/**
 * Singleton IntersectionObserver for scroll-reveal animations.
 * Mount once in the website layout — it watches every [data-reveal] element
 * on the page, adds "is-revealed" when the element enters the viewport,
 * then stops observing it. No per-element React wrappers needed.
 *
 * CSS is in globals.css under html.js-reveal-ready [data-reveal].
 * The class is only applied after this effect runs, so without JS
 * all content stays fully visible (no flash of invisible content).
 */
export default function ScrollReveal() {
  useEffect(() => {
    // Signal to CSS that JS is active → apply the initial hidden state
    document.documentElement.classList.add("js-reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -32px 0px",
      },
    );

    const observeAll = () => {
      document
        .querySelectorAll<Element>("[data-reveal]:not(.is-revealed)")
        .forEach((el) => observer.observe(el));
    };

    observeAll();

    // Re-scan after client-side navigation adds new content
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
      document.documentElement.classList.remove("js-reveal-ready");
    };
  }, []);

  return null;
}
