"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getT } from "@/lib/i18n";
import { submitEnrollment } from "@/lib/actions/enrollment.action";

// ─── Form shape (schema is created inside the dialog to support i18n) ─────────

type ApplyFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  langLevel: string;
  program: string;
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface ApplyModalContextType {
  openModal: () => void;
}

const ApplyModalContext = createContext<ApplyModalContextType>({
  openModal: () => {},
});

export function useApplyModal() {
  return useContext(ApplyModalContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ApplyModalProvider({
  children,
  locale,
  programs = [],
}: {
  children: React.ReactNode;
  locale: string;
  programs?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <ApplyModalContext.Provider value={{ openModal }}>
      {children}
      {isOpen && <ApplyModalDialog locale={locale} onClose={closeModal} programs={programs} />}
    </ApplyModalContext.Provider>
  );
}

// ─── Internal dialog ──────────────────────────────────────────────────────────

function ApplyModalDialog({
  locale,
  onClose,
  programs,
}: {
  locale: string;
  onClose: () => void;
  programs: string[];
}) {
  const t = getT(locale);

  // ── Locale-aware schema (rebuilt only when locale changes) ──────────────────
  const applySchema = useMemo(
    () =>
      z.object({
        firstName: z.string().min(1, t("apply.err.firstName")).max(50, t("apply.err.firstNameMax")),
        lastName: z.string().min(1, t("apply.err.lastName")).max(50, t("apply.err.lastNameMax")),
        email: z.string().min(1, t("apply.err.email")).email(t("apply.err.emailFormat")),
        phone: z.string().min(7, t("apply.err.phone")).max(20, t("apply.err.phoneMax")),
        langLevel: z.string().min(1, t("apply.err.langLevel")),
        program: z.string().min(1, t("apply.err.program")),
      }),
    // locale is the only stable dep — t() is recreated each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  // mount guard — needed so createPortal only runs client-side
  const [mounted, setMounted] = useState(false);
  // drives CSS transition: starts false, set true one frame after mount
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  // ── react-hook-form ─────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    mode: "onBlur",           // show error as soon as the field loses focus
    defaultValues: {
      firstName: "",
      lastName:  "",
      email:     "",
      phone:     "",
      langLevel: "",
      program:   "",
    },
  });

  // ── Handlers ───────────────────────────────────────────
  // Declared before the effects so the Escape key useEffect can reference it.
  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  // ── Lifecycle ──────────────────────────────────────────
  // Two nested RAFs:
  //  Frame 1 — mount the portal so the element exists in the DOM
  //  Frame 2 — flip visible=true to trigger the CSS scale/opacity transition
  // Neither setState is called synchronously inside the effect body, which
  // satisfies the react-hooks/set-state-in-effect lint rule.
  useEffect(() => {
    let visibleId: number;
    const mountedId = requestAnimationFrame(() => {
      setMounted(true);
      visibleId = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(mountedId);
      cancelAnimationFrame(visibleId);
    };
  }, []);

  // lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // focus panel for a11y
  useEffect(() => {
    contentRef.current?.focus();
  }, []);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // Focus trap — cycle Tab/Shift+Tab within the dialog
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const FOCUSABLE =
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [submitted]);

  async function onSubmit(values: ApplyFormValues) {
    setServerError(null);
    const result = await submitEnrollment({
      first_name:       values.firstName.trim(),
      last_name:        values.lastName.trim(),
      email:            values.email.trim(),
      phone:            values.phone.trim(),
      japanese_level:   values.langLevel,
      program_interest: values.program,
    });
    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(t("apply.error"));
    }
  }

  // ── Shared input classes ───────────────────────────────
  const baseCls =
    "w-full p-3.5 border rounded-xl font-[family-name:var(--font-poppins)] text-base text-jn-text-dark bg-jn-bg-off focus:outline-none focus:bg-white focus:ring-4 transition-all";
  const normalBorder = "border-jn-border focus:border-jn-primary focus:ring-jn-primary-light";
  const errorBorder  = "border-red-400 focus:border-red-400 focus:ring-red-100";

  const cls = (field: keyof typeof errors) =>
    `${baseCls} ${errors[field] ? errorBorder : normalBorder}`;

  // ── JSX ────────────────────────────────────────────────
  const dialog = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="applyModalTitle"
      aria-describedby="applyModalDesc"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-jn-primary-dark/80 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`relative z-10 bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-[2rem] shadow-2xl outline-none transition-all duration-300 transform ${
          visible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-3"
        }`}
      >
        {/* Close button */}
        <div className="absolute top-0 right-0 z-20 p-4 md:p-6">
          <button
            type="button"
            onClick={handleClose}
            aria-label={t("apply.closeLabel")}
            className="text-jn-text-muted hover:text-jn-text-dark bg-white/90 hover:bg-jn-bg-off backdrop-blur-sm shadow-sm border border-jn-border rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 w-full p-8 md:p-12 pt-16 md:pt-20">
          {submitted ? (
            /* ── Success screen ──────────────────────────── */
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold font-[family-name:var(--font-poppins)] text-jn-text-dark mb-3">
                {t("apply.success")}
              </h3>
              <p className="text-jn-text-muted mb-8">{t("apply.successDesc")}</p>
              <button
                type="button"
                onClick={handleClose}
                className="jn-btn jn-btn-primary"
              >
                {t("apply.successClose")}
              </button>
            </div>
          ) : (
            /* ── Form screen ─────────────────────────────── */
            <>
              <span className="jn-section-label mb-4 block">
                {t("apply.label")}
              </span>
              <h3
                id="applyModalTitle"
                className="text-3xl font-semibold font-[family-name:var(--font-poppins)] text-jn-text-dark mb-2"
              >
                {t("apply.title")}
              </h3>
              <p id="applyModalDesc" className="text-jn-text-muted mb-8">
                {t("apply.desc")}
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* First / Last name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[0.9rem] font-semibold text-jn-text-dark mb-2">
                      {t("apply.firstName")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("apply.firstNamePh")}
                      className={cls("firstName")}
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p role="alert" className="text-red-500 text-xs mt-1.5">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[0.9rem] font-semibold text-jn-text-dark mb-2">
                      {t("apply.lastName")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("apply.lastNamePh")}
                      className={cls("lastName")}
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p role="alert" className="text-red-500 text-xs mt-1.5">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email / Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[0.9rem] font-semibold text-jn-text-dark mb-2">
                      {t("apply.email")}
                    </label>
                    <input
                      type="email"
                      placeholder={t("apply.emailPh")}
                      className={cls("email")}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p role="alert" className="text-xs text-red-500 mt-1.5">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[0.9rem] font-semibold text-jn-text-dark mb-2">
                      {t("apply.phone")}
                    </label>
                    <input
                      type="tel"
                      placeholder={t("apply.phonePh")}
                      className={cls("phone")}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p role="alert" className="text-xs text-red-500 mt-1.5">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Japanese Level */}
                <div>
                  <label
                    htmlFor="applyLangLevel"
                    className="block text-[0.9rem] font-semibold text-jn-text-dark mb-2"
                  >
                    {t("apply.langLevel")}
                  </label>
                  <select
                    id="applyLangLevel"
                    className={cls("langLevel")}
                    {...register("langLevel")}
                  >
                    <option value="">{t("apply.langLevelPh")}</option>
                    <option value={t("apply.lang.beginner")}>
                      {t("apply.lang.beginner")}
                    </option>
                    <option value={t("apply.lang.n5")}>
                      {t("apply.lang.n5")}
                    </option>
                    <option value={t("apply.lang.n4")}>
                      {t("apply.lang.n4")}
                    </option>
                    <option value={t("apply.lang.n3")}>
                      {t("apply.lang.n3")}
                    </option>
                  </select>
                  {errors.langLevel && (
                    <p role="alert" className="text-xs text-red-500 mt-1.5">
                      {errors.langLevel.message}
                    </p>
                  )}
                </div>

                {/* Program */}
                <div>
                  <label
                    htmlFor="applyProgram"
                    className="block text-[0.9rem] font-semibold text-jn-text-dark mb-2"
                  >
                    {t("apply.program")}
                  </label>
                  <select
                    id="applyProgram"
                    className={cls("program")}
                    {...register("program")}
                  >
                    <option value="">{t("apply.programPh")}</option>
                    {programs.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                    <option value={t("apply.prog.unsure")}>
                      {t("apply.prog.unsure")}
                    </option>
                  </select>
                  {errors.program && (
                    <p role="alert" className="text-xs text-red-500 mt-1.5">
                      {errors.program.message}
                    </p>
                  )}
                </div>

                {/* Server error */}
                {serverError && (
                  <p role="alert" className="text-red-500 text-sm">
                    {serverError}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="jn-btn jn-btn-primary w-full py-4 text-[1.05rem] mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {t("apply.submitting")}
                    </span>
                  ) : (
                    t("apply.submit")
                  )}
                </button>

                <p className="text-center text-[0.8rem] text-jn-text-muted mt-4 mb-0">
                  {t("apply.terms")}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(dialog, document.body);
}
