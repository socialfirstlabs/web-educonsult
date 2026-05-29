"use client";

import { useApplyModal } from "@/components/website/ApplyModal";

interface ApplyButtonProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Thin client wrapper — renders a <button> that opens the Apply Modal.
 * Use this inside Server Components where you can't call useApplyModal directly.
 */
export default function ApplyButton({ className, children }: ApplyButtonProps) {
  const { openModal } = useApplyModal();

  return (
    <button type="button" onClick={openModal} className={className}>
      {children}
    </button>
  );
}
